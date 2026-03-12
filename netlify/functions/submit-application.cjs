const fs = require('node:fs/promises');
const path = require('node:path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const { Resend } = require('resend');
const { createPersistenceProvider } = require('./_lib/persistence.cjs');

const TEMPLATE_PATHS = {
  traditional: path.resolve(process.cwd(), 'assets/forms/traditional-proposal-form.pdf'),
  annuity: path.resolve(process.cwd(), 'assets/forms/annuity-proposal-form.pdf'),
};

const TRADITIONAL_FORM_VERSION = 'traditional-dec-2025-v1';
const ANNUITY_FORM_VERSION = 'annuity-dec-2026-v1';
const PDF_PREFILL_ENABLED = process.env.ENABLE_PDF_PREFILL === 'true';
const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
]);
const MAX_UPLOAD_FILE_BYTES = 4 * 1024 * 1024;
const MAX_TOTAL_UPLOAD_BYTES = 20 * 1024 * 1024;
const REQUIRED_DOC_TYPES = new Set([
  'payment_receipt',
  'valid_id',
  'utility_bill',
  'passport_photo',
]);

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

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

const decodeBase64 = (contentBase64) => {
  try {
    return Buffer.from(contentBase64, 'base64');
  } catch {
    const error = new Error('Invalid base64 document content.');
    error.code = 'INVALID_DOCUMENT_BASE64';
    throw error;
  }
};

const normalizeUploadedDocuments = (uploadedDocuments) => {
  if (!Array.isArray(uploadedDocuments)) return [];

  let totalBytes = 0;
  const normalized = uploadedDocuments.map((doc, index) => {
    const filename = String(doc?.filename || '').trim();
    const docType = String(doc?.docType || '').trim();
    const mimeType = String(doc?.mimeType || '').trim().toLowerCase();
    const contentBase64 = String(doc?.contentBase64 || '').trim();
    const binary = decodeBase64(contentBase64);
    const sizeBytes = binary.byteLength;

    if (!filename || !docType || !mimeType || !contentBase64) {
      const error = new Error(`Document ${index + 1} is missing required fields.`);
      error.code = 'DOCUMENT_FIELDS_MISSING';
      throw error;
    }

    if (!ALLOWED_UPLOAD_MIME_TYPES.has(mimeType)) {
      const error = new Error(
        `Document ${filename} has unsupported type ${mimeType}. Allowed: PDF, JPG, PNG.`,
      );
      error.code = 'DOCUMENT_TYPE_NOT_ALLOWED';
      throw error;
    }

    if (sizeBytes > MAX_UPLOAD_FILE_BYTES) {
      const error = new Error(
        `Document ${filename} exceeds max size of ${Math.round(MAX_UPLOAD_FILE_BYTES / (1024 * 1024))}MB.`,
      );
      error.code = 'DOCUMENT_TOO_LARGE';
      throw error;
    }

    totalBytes += sizeBytes;
    return {
      docType,
      filename,
      mimeType,
      sizeBytes,
      contentBase64,
    };
  });

  if (totalBytes > MAX_TOTAL_UPLOAD_BYTES) {
    const error = new Error(
      `Total upload size exceeds ${Math.round(MAX_TOTAL_UPLOAD_BYTES / (1024 * 1024))}MB.`,
    );
    error.code = 'DOCUMENT_TOTAL_TOO_LARGE';
    throw error;
  }

  const docTypesPresent = new Set(normalized.map((doc) => doc.docType));
  const missingRequiredDocTypes = [...REQUIRED_DOC_TYPES].filter(
    (docType) => !docTypesPresent.has(docType),
  );
  if (missingRequiredDocTypes.length > 0) {
    const error = new Error(
      `Missing required uploads: ${missingRequiredDocTypes.join(', ')}.`,
    );
    error.code = 'DOCUMENT_REQUIRED_MISSING';
    throw error;
  }

  return normalized;
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
  // First-page BVN/NIN fields in this template revision.
  { field: 'Text Field 87', value: data.bvn || '', required: false, source: 'bvn' },
  { field: 'Text Field 92', value: data.nin || '', required: false, source: 'nin' },
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

const buildFormAttachment = async ({
  templateBytes,
  isAnnuity,
  payload,
  referenceNumber,
  prefillEnabled,
}) => {
  if (!prefillEnabled) {
    // Keep client template untouched until a confirmed field map is available.
    return templateBytes;
  }

  return isAnnuity
    ? await fillAnnuityForm(templateBytes, payload, referenceNumber)
    : await fillTraditionalForm(templateBytes, payload, referenceNumber);
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
  line('Health', '', true);
  line('Serious Medical Condition', data.hasMedicalCondition === true ? 'Yes' : 'No');
  if (Array.isArray(data.medicalConditions) && data.medicalConditions.length > 0) {
    line('Medical Conditions', data.medicalConditions.join(', '));
  }
  line('Other Condition', data.otherCondition || '');
  line('Height (cm)', data.height || '');
  line('Weight (kg)', data.weight || '');
  if (data.smokes !== undefined) {
    line('Smoker', data.smokes ? 'Yes' : 'No');
  }
  if (data.onMedication !== undefined) {
    line('On Medication', data.onMedication ? 'Yes' : 'No');
  }
  line('Medication Details', data.medicationDetails || '');
  if (data.liveOutsideNigeria !== undefined) {
    line('Live Outside Nigeria', data.liveOutsideNigeria ? 'Yes' : 'No');
  }
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

const buildHtmlSummary = (payload, referenceNumber, prefillEnabled, uploadedDocuments = []) => {
  const { data, quoteLabel, quoteAmount, paymentReference, paymentAmount } = payload;
  const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
  const docsList = uploadedDocuments
    .map((doc) => `<li>${doc.docType}: ${doc.filename}</li>`)
    .join('');
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
      <p><strong>Payment Reference:</strong> ${paymentReference || 'N/A'}</p>
      <p><strong>Payment Amount:</strong> ${paymentAmount ? `₦${Number(paymentAmount).toLocaleString()}` : 'N/A'}</p>
      <p><strong>Health Status:</strong> ${
        data.hasMedicalCondition === true ? 'Medical condition declared' : 'No serious condition declared'
      }</p>
      <p><strong>Uploaded Documents:</strong></p>
      <ul>${docsList || '<li>None</li>'}</ul>
      <hr />
      <p>${
        prefillEnabled
          ? 'This email includes attached prefilled proposal form and an application summary PDF.'
          : 'This email includes the official blank proposal form and a fully filled application summary PDF for internal completion.'
      }</p>
    </div>
  `;
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON payload' });
  }

  const { data, digitalSignature, quoteLabel, quoteAmount, paymentReference, paymentAmount } = payload || {};
  if (!data || !digitalSignature || !data.goal) {
    return jsonResponse(400, { error: 'Missing required submission details' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const toEmail = process.env.RESEND_TO_EMAIL || 'aedada@custodianinsurance.com';

  if (!apiKey || !fromEmail) {
    return jsonResponse(503, {
      error: 'Submission service is not configured yet. Please try again shortly.',
    });
  }

  const referenceNumber = generateReference();
  const persistence = createPersistenceProvider(process.env);

  try {
    const uploadedDocuments = normalizeUploadedDocuments(payload?.uploadedDocuments);
    const applicantFullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
    const persistedApplication = await persistence.createApplication({
      publicRef: referenceNumber,
      applicantFullName,
      email: data.email || null,
      phone: cleanPhone(data.phoneNumber) || null,
      productType: data.goal,
      payloadJson: payload,
      paymentReference: paymentReference || null,
      paymentAmount: paymentAmount || null,
      status: 'submitted',
    });

    if (uploadedDocuments.length > 0) {
      await persistence.addDocuments(
        persistedApplication.id,
        uploadedDocuments.map((doc) => ({
          ...doc,
          storageBucket: null,
          storagePath: null,
        })),
      );
    }

    const isAnnuity = data.goal === 'annuity';
    const templatePath = isAnnuity ? TEMPLATE_PATHS.annuity : TEMPLATE_PATHS.traditional;
    await ensureTemplateExists(templatePath);
    const templateBytes = await fs.readFile(templatePath);

    const formPdfBytes = await buildFormAttachment({
      templateBytes,
      isAnnuity,
      payload,
      referenceNumber,
      prefillEnabled: PDF_PREFILL_ENABLED,
    });

    const summaryPdfBytes = await buildSummaryPdf(payload, referenceNumber);
    const resend = new Resend(apiKey);
    const supportingDocuments = uploadedDocuments.map((doc) => ({
      filename: doc.filename,
      content: doc.contentBase64,
      contentType: doc.mimeType,
    }));

    const sendResult = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: data.email || undefined,
      subject: `New Application ${referenceNumber} - ${data.goal}`,
      html: buildHtmlSummary(
        { data, quoteLabel, quoteAmount, paymentReference, paymentAmount },
        referenceNumber,
        PDF_PREFILL_ENABLED,
        uploadedDocuments,
      ),
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
        ...supportingDocuments,
      ],
    });

    if (sendResult?.error) {
      const resendError = new Error(
        sendResult.error.message || 'Resend rejected the email request.',
      );
      resendError.code = 'RESEND_SEND_FAILED';
      throw resendError;
    }

    await persistence.addEvent(persistedApplication.id, 'emailed', {
      toEmail,
      referenceNumber,
      uploadedDocumentCount: uploadedDocuments.length,
    });

    return jsonResponse(200, { referenceNumber });
  } catch (error) {
    console.error('submit-application failed', error);
    const normalized = normalizeError(error);

    if (normalized.code === 'TEMPLATE_NOT_FOUND' || normalized.code === 'ENOENT') {
      return jsonResponse(500, {
        error: 'Submission failed because form templates are missing on the server deployment.',
      });
    }

    if (
      normalized.code === 'SUPABASE_CONFIG_MISSING' ||
      normalized.code === 'SUPABASE_INSERT_FAILED' ||
      normalized.code === 'SUPABASE_EMPTY_INSERT_RESULT'
    ) {
      return jsonResponse(503, {
        error: `Submission persistence error: ${normalized.message}`,
      });
    }

    if (
      normalized.code === 'DOCUMENT_FIELDS_MISSING' ||
      normalized.code === 'DOCUMENT_TYPE_NOT_ALLOWED' ||
      normalized.code === 'DOCUMENT_TOO_LARGE' ||
      normalized.code === 'DOCUMENT_TOTAL_TOO_LARGE' ||
      normalized.code === 'DOCUMENT_REQUIRED_MISSING' ||
      normalized.code === 'INVALID_DOCUMENT_BASE64'
    ) {
      return jsonResponse(400, {
        error: normalized.message,
      });
    }

    if (
      normalized.code === 'PDF_MAPPING_FIELDS_MISSING' ||
      normalized.code === 'PDF_MAPPING_VALUES_MISSING'
    ) {
      return jsonResponse(422, {
        error: `PDF mapping validation failed: ${normalized.message}`,
      });
    }

    if (
      normalized.code === 'RESEND_SEND_FAILED' ||
      normalized.code === 'validation_error' ||
      normalized.code === 'unknown_error' ||
      normalized.code.toLowerCase().includes('resend')
    ) {
      return jsonResponse(502, {
        error: `Email submission failed at the mail provider: ${normalized.message}`,
      });
    }

    return jsonResponse(500, {
      error: `Application submission failed (${normalized.code}): ${normalized.message}`,
    });
  }
};
