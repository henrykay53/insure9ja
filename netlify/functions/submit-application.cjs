const fs = require('node:fs/promises');
const path = require('node:path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const { Resend } = require('resend');

const TEMPLATE_PATHS = {
  traditional: path.resolve(process.cwd(), 'assets/forms/traditional-proposal-form.pdf'),
  annuity: path.resolve(process.cwd(), 'assets/forms/annuity-proposal-form.pdf'),
};

const formatDate = (value) => {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return '';
  return `${day}/${month}/${year}`;
};

const cleanPhone = (value) => {
  if (!value) return '';
  return `+234${String(value).replace(/\\D/g, '')}`;
};

const generateReference = () => {
  const now = new Date();
  const parts = [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, '0'),
    String(now.getUTCDate()).padStart(2, '0'),
    String(now.getUTCHours()).padStart(2, '0'),
    String(now.getUTCMinutes()).padStart(2, '0'),
    String(now.getUTCSeconds()).padStart(2, '0'),
  ];
  return `INS-${parts.join('')}`;
};

const setTextFieldSafe = (form, fieldName, value) => {
  if (!value) return;
  try {
    const field = form.getTextField(fieldName);
    field.setText(String(value));
  } catch {
    // Ignore unknown/mismatched fields in client templates.
  }
};

const fillTraditionalForm = async (bytes, payload, referenceNumber) => {
  const pdf = await PDFDocument.load(bytes);
  const form = pdf.getForm();
  const { data, digitalSignature, quoteLabel, quoteAmount } = payload;

  setTextFieldSafe(form, 'CD_Surname', data.lastName);
  setTextFieldSafe(form, 'CD_FirstName', data.firstName);
  setTextFieldSafe(form, 'CD_MiddleName', '');
  setTextFieldSafe(form, 'CD_D.O.B', formatDate(data.personalDOB || data.dateOfBirth));
  setTextFieldSafe(form, 'CD_EmailAddress', data.email);
  setTextFieldSafe(form, 'CD_Telephone', cleanPhone(data.phoneNumber));
  setTextFieldSafe(form, 'CD_Telephone 1', cleanPhone(data.phoneNumber));
  setTextFieldSafe(form, 'CD_Nationality', 'Nigerian');
  setTextFieldSafe(form, 'CD_ResidentialAddress', 'Provided in online application');
  setTextFieldSafe(form, 'CD_Contact address', 'Provided in online application');
  setTextFieldSafe(form, 'CD_TIN', data.bvn || data.nin || '');
  setTextFieldSafe(form, 'Text Field 97', `Ref: ${referenceNumber}`);
  setTextFieldSafe(form, 'Text Field 96', `${quoteLabel}: ₦${Number(quoteAmount || 0).toLocaleString()}`);
  setTextFieldSafe(form, 'Text Field 95', data.goal || '');
  setTextFieldSafe(form, 'Text Field 94', digitalSignature);

  form.flatten();
  return await pdf.save();
};

const fillAnnuityForm = async (bytes, payload, referenceNumber) => {
  const pdf = await PDFDocument.load(bytes);
  const form = pdf.getForm();
  const { data, digitalSignature, quoteLabel, quoteAmount } = payload;

  // The annuity template uses generic field names; we populate core summary fields conservatively.
  setTextFieldSafe(form, 'Text Field 97', `Ref: ${referenceNumber}`);
  setTextFieldSafe(form, 'Text Field 96', `${data.firstName || ''} ${data.lastName || ''}`.trim());
  setTextFieldSafe(form, 'Text Field 95', data.email);
  setTextFieldSafe(form, 'Text Field 94', cleanPhone(data.phoneNumber));
  setTextFieldSafe(form, 'Text Field 90', `${quoteLabel}: ₦${Number(quoteAmount || 0).toLocaleString()}`);
  setTextFieldSafe(form, 'Text Field 89', data.coverageAmount || '');
  setTextFieldSafe(form, 'Text Field 88', formatDate(data.personalDOB || data.dateOfBirth));
  setTextFieldSafe(form, 'Text Field 87', data.annuityOption || '');
  setTextFieldSafe(form, 'Text Field 86', digitalSignature);

  form.flatten();
  return await pdf.save();
};

const buildSummaryPdf = async (payload, referenceNumber) => {
  const { data, digitalSignature, quoteLabel, quoteAmount } = payload;
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = 800;
  const line = (label, value, isHeading = false) => {
    page.drawText(`${label}${value ? `: ${value}` : ''}`, {
      x: 50,
      y,
      size: isHeading ? 14 : 10,
      font: isHeading ? bold : font,
      color: rgb(0.15, 0.15, 0.15),
    });
    y -= isHeading ? 22 : 16;
  };

  line('Insure9ja Application Summary', '', true);
  line('Reference', referenceNumber);
  line('Submitted At (UTC)', new Date().toISOString());
  y -= 6;
  line('Applicant', '', true);
  line('Name', `${data.firstName || ''} ${data.lastName || ''}`.trim());
  line('Email', data.email);
  line('Phone', cleanPhone(data.phoneNumber));
  line('DOB', formatDate(data.personalDOB || data.dateOfBirth));
  y -= 6;
  line('Plan', '', true);
  line('Goal', data.goal || '');
  line('Refund Schedule', data.refundSchedule || '');
  line('Annuity Option', data.annuityOption || '');
  line('Coverage/Contribution', data.coverageAmount || '');
  line(quoteLabel, `₦${Number(quoteAmount || 0).toLocaleString()}`);
  y -= 6;
  line('Identity', '', true);
  line('BVN', data.bvn || '');
  line('NIN', data.nin || '');
  line('ID Type', data.idType || '');
  line('ID Number', data.idNumber || '');
  y -= 6;
  line('Beneficiaries', `${Array.isArray(data.beneficiaries) ? data.beneficiaries.length : 0}`);
  if (Array.isArray(data.beneficiaries)) {
    for (const b of data.beneficiaries.slice(0, 6)) {
      line('-', `${b.fullName || 'N/A'} (${b.relationship || 'N/A'}) ${b.percentage || 0}%`);
    }
  }
  y -= 6;
  line('Digital Signature', digitalSignature || '');

  return await pdf.save();
};

const buildHtmlSummary = (payload, referenceNumber) => {
  const { data, quoteLabel, quoteAmount } = payload;
  const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
      <h2 style="margin-bottom:8px">New Insure9ja Application</h2>
      <p><strong>Reference:</strong> ${referenceNumber}</p>
      <p><strong>Name:</strong> ${fullName || 'N/A'}</p>
      <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
      <p><strong>Phone:</strong> ${cleanPhone(data.phoneNumber) || 'N/A'}</p>
      <p><strong>Plan:</strong> ${data.goal || 'N/A'}</p>
      <p><strong>${quoteLabel}:</strong> ₦${Number(quoteAmount || 0).toLocaleString()}</p>
      <p><strong>Coverage/Contribution:</strong> ${data.coverageAmount || 'N/A'}</p>
      <p><strong>DOB:</strong> ${formatDate(data.personalDOB || data.dateOfBirth) || 'N/A'}</p>
      <hr />
      <p>This email includes attached prefilled proposal form and an application summary PDF.</p>
    </div>
  `;
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON payload' }),
    };
  }

  const { data, digitalSignature, quoteLabel, quoteAmount } = payload || {};
  if (!data || !digitalSignature || !data.goal) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required submission details' }),
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const toEmail = process.env.RESEND_TO_EMAIL || 'aedada@custodianinsurance.com';

  if (!apiKey || !fromEmail) {
    return {
      statusCode: 503,
      body: JSON.stringify({
        error:
          'Submission service is not configured yet. Please try again shortly.',
      }),
    };
  }

  const referenceNumber = generateReference();

  try {
    const isAnnuity = data.goal === 'annuity';
    const templatePath = isAnnuity ? TEMPLATE_PATHS.annuity : TEMPLATE_PATHS.traditional;
    const templateBytes = await fs.readFile(templatePath);

    const formPdfBytes = isAnnuity
      ? await fillAnnuityForm(templateBytes, payload, referenceNumber)
      : await fillTraditionalForm(templateBytes, payload, referenceNumber);

    const summaryPdfBytes = await buildSummaryPdf(payload, referenceNumber);
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: data.email || undefined,
      subject: `New Application ${referenceNumber} - ${data.goal}`,
      html: buildHtmlSummary({ data, quoteLabel, quoteAmount }, referenceNumber),
      attachments: [
        {
          filename: isAnnuity
            ? `annuity-proposal-${referenceNumber}.pdf`
            : `traditional-proposal-${referenceNumber}.pdf`,
          content: Buffer.from(formPdfBytes),
        },
        {
          filename: `application-summary-${referenceNumber}.pdf`,
          content: Buffer.from(summaryPdfBytes),
        },
      ],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ referenceNumber }),
    };
  } catch (error) {
    console.error('submit-application failed', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Application submission failed. Please try again.',
      }),
    };
  }
};
