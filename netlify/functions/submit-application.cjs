const fs = require('node:fs/promises');
const path = require('node:path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const { Resend } = require('resend');

const TEMPLATE_PATHS = {
  traditional: path.resolve(process.cwd(), 'assets/forms/traditional-proposal-form.pdf'),
  annuity: path.resolve(process.cwd(), 'assets/forms/annuity-proposal-form.pdf'),
};

const TRADITIONAL_FORM_VERSION = 'traditional-dec-2025-v1';
const ANNUITY_FORM_VERSION = 'annuity-dec-2026-v1';

const ensureTemplateExists = async (templatePath) => {
  try {
    await fs.access(templatePath);
  } catch {
    const error = new Error(`Template file not found: ${templatePath}`);
    error.code = 'TEMPLATE_NOT_FOUND';
    throw error;
  }
};

const normalizeError = (error) => {
  if (!error) return { code: 'UNKNOWN', message: 'Unknown error' };
  const code = error.code || error.name || 'UNKNOWN';
  const message = error.message || String(error);
  return { code: String(code), message: String(message) };
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

const formatCurrencyForPdf = (amount) => {
  return `NGN ${Number(amount || 0).toLocaleString()}`;
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

const getTraditionalFieldMap = (data) => [
  { field: 'CD_Surname', value: data.lastName, required: true, source: 'lastName' },
  { field: 'CD_FirstName', value: data.firstName, required: true, source: 'firstName' },
  { field: 'CD_MiddleName', value: '', required: false, source: 'middleName' },
  {
    field: 'CD_D.O.B',
    value: formatDate(data.personalDOB || data.dateOfBirth),
    required: true,
    source: 'personalDOB/dateOfBirth',
  },
  { field: 'CD_EmailAddress', value: data.email, required: true, source: 'email' },
  { field: 'CD_Telephone', value: cleanPhone(data.phoneNumber), required: true, source: 'phoneNumber' },
  { field: 'CD_Nationality', value: 'Nigerian', required: false, source: 'constant' },
  // In this template revision these generic fields correspond to BVN/NIN visually.
  { field: 'Text Field 100', value: data.bvn || '', required: false, source: 'bvn' },
  { field: 'Text Field 86', value: data.nin || '', required: false, source: 'nin' },
];

const getAnnuityFieldMap = (data, referenceNumber, quoteLabel, quoteAmount, digitalSignature) => [
  { field: 'Text Field 97', value: `Ref: ${referenceNumber}`, required: false, source: 'reference' },
  {
    field: 'Text Field 96',
    value: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
    required: true,
    source: 'firstName/lastName',
  },
  { field: 'Text Field 95', value: data.email, required: true, source: 'email' },
  { field: 'Text Field 94', value: cleanPhone(data.phoneNumber), required: true, source: 'phoneNumber' },
  {
    field: 'Text Field 90',
    value: `${quoteLabel}: ${formatCurrencyForPdf(quoteAmount)}`,
    required: false,
    source: 'quote',
  },
  { field: 'Text Field 89', value: data.coverageAmount || '', required: false, source: 'coverageAmount' },
  {
    field: 'Text Field 88',
    value: formatDate(data.personalDOB || data.dateOfBirth),
    required: false,
    source: 'personalDOB/dateOfBirth',
  },
  { field: 'Text Field 87', value: data.annuityOption || '', required: false, source: 'annuityOption' },
  { field: 'Text Field 86', value: digitalSignature, required: false, source: 'digitalSignature' },
];

const applyMappedFields = (form, mappings, templateVersion) => {
  const availableFields = new Set(form.getFields().map((f) => f.getName()));
  const missingMappedFields = [];
  const emptyRequiredValues = [];

  for (const mapping of mappings) {
    const hasField = availableFields.has(mapping.field);
    if (!hasField) {
      if (mapping.required) {
        missingMappedFields.push(mapping.field);
      }
      continue;
    }

    const normalizedValue = String(mapping.value ?? '').trim();
    if (!normalizedValue) {
      if (mapping.required) {
        emptyRequiredValues.push(`${mapping.source}->${mapping.field}`);
      }
      continue;
    }

    setTextFieldSafe(form, mapping.field, normalizedValue);
  }

  if (missingMappedFields.length > 0) {
    const error = new Error(
      `Required mapped fields missing in template ${templateVersion}: ${missingMappedFields.join(', ')}`,
    );
    error.code = 'PDF_MAPPING_FIELDS_MISSING';
    throw error;
  }

  if (emptyRequiredValues.length > 0) {
    const error = new Error(
      `Required values missing for template ${templateVersion}: ${emptyRequiredValues.join(', ')}`,
    );
    error.code = 'PDF_MAPPING_VALUES_MISSING';
    throw error;
  }
};

const fillTraditionalForm = async (bytes, payload, referenceNumber) => {
  const pdf = await PDFDocument.load(bytes);
  const form = pdf.getForm();
  const { data } = payload;
  void referenceNumber;

  applyMappedFields(form, getTraditionalFieldMap(data), TRADITIONAL_FORM_VERSION);

  form.flatten();
  return await pdf.save();
};

const fillAnnuityForm = async (bytes, payload, referenceNumber) => {
  const pdf = await PDFDocument.load(bytes);
  const form = pdf.getForm();
  const { data, digitalSignature, quoteLabel, quoteAmount } = payload;
  applyMappedFields(
    form,
    getAnnuityFieldMap(data, referenceNumber, quoteLabel, quoteAmount, digitalSignature),
    ANNUITY_FORM_VERSION,
  );

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
  line(quoteLabel, formatCurrencyForPdf(quoteAmount));
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
    await ensureTemplateExists(templatePath);
    const templateBytes = await fs.readFile(templatePath);

    const formPdfBytes = isAnnuity
      ? await fillAnnuityForm(templateBytes, payload, referenceNumber)
      : await fillTraditionalForm(templateBytes, payload, referenceNumber);

    const summaryPdfBytes = await buildSummaryPdf(payload, referenceNumber);
    const resend = new Resend(apiKey);

    const sendResult = await resend.emails.send({
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
          content: Buffer.from(formPdfBytes).toString('base64'),
          contentType: 'application/pdf',
        },
        {
          filename: `application-summary-${referenceNumber}.pdf`,
          content: Buffer.from(summaryPdfBytes).toString('base64'),
          contentType: 'application/pdf',
        },
      ],
    });

    if (sendResult?.error) {
      const resendError = new Error(
        sendResult.error.message || 'Resend rejected the email request.',
      );
      resendError.code = 'RESEND_SEND_FAILED';
      throw resendError;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ referenceNumber }),
    };
  } catch (error) {
    console.error('submit-application failed', error);
    const normalized = normalizeError(error);

    if (normalized.code === 'TEMPLATE_NOT_FOUND' || normalized.code === 'ENOENT') {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error:
            'Submission failed because form templates are missing on the server deployment.',
        }),
      };
    }

    if (
      normalized.code === 'PDF_MAPPING_FIELDS_MISSING' ||
      normalized.code === 'PDF_MAPPING_VALUES_MISSING'
    ) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: `PDF mapping validation failed: ${normalized.message}`,
        }),
      };
    }

    if (
      normalized.code === 'RESEND_SEND_FAILED' ||
      normalized.code === 'validation_error' ||
      normalized.code === 'unknown_error' ||
      normalized.code.toLowerCase().includes('resend')
    ) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: `Email submission failed at the mail provider: ${normalized.message}`,
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Application submission failed (${normalized.code}): ${normalized.message}`,
      }),
    };
  }
};
