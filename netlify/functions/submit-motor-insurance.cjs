const { Resend } = require('resend');
const { createPersistenceProvider } = require('./_lib/persistence.cjs');

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
  'drivers_licence',
  'vehicle_license',
  'passport_photo',
]);
const REQUIRED_COMPREHENSIVE_DOC_TYPES = new Set([
  'vehicle_front',
  'vehicle_back',
  'vehicle_left',
  'vehicle_right',
  'vehicle_dashboard_mileage',
  'vehicle_vin',
]);

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

const normalizeError = (error) => {
  if (!error) return { code: 'UNKNOWN', message: 'Unknown error' };
  return {
    code: String(error.code || error.name || 'UNKNOWN'),
    message: String(error.message || String(error)),
  };
};

const cleanPhone = (value) => {
  if (!value) return '';
  return `+234${String(value).replace(/\D/g, '')}`;
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
  return `MTR-${parts.join('')}`;
};

const normalizeUploadedDocuments = (uploadedDocuments, coverType) => {
  if (!Array.isArray(uploadedDocuments) || uploadedDocuments.length === 0) {
    const error = new Error('Please upload required documents.');
    error.code = 'DOCUMENT_REQUIRED_MISSING';
    throw error;
  }

  let totalBytes = 0;
  const normalized = uploadedDocuments.map((doc, index) => {
    const filename = String(doc?.filename || '').trim();
    const docType = String(doc?.docType || '').trim();
    const mimeType = String(doc?.mimeType || '').trim().toLowerCase();
    const contentBase64 = String(doc?.contentBase64 || '').trim();
    const binary = Buffer.from(contentBase64, 'base64');
    const sizeBytes = binary.byteLength;

    if (!filename || !docType || !mimeType || !contentBase64) {
      const error = new Error(`Document ${index + 1} is missing required fields.`);
      error.code = 'DOCUMENT_FIELDS_MISSING';
      throw error;
    }
    if (!ALLOWED_UPLOAD_MIME_TYPES.has(mimeType)) {
      const error = new Error(`Unsupported file type for ${filename}.`);
      error.code = 'DOCUMENT_TYPE_NOT_ALLOWED';
      throw error;
    }
    if (sizeBytes > MAX_UPLOAD_FILE_BYTES) {
      const error = new Error(`${filename} exceeds 4MB.`);
      error.code = 'DOCUMENT_TOO_LARGE';
      throw error;
    }

    totalBytes += sizeBytes;
    return { docType, filename, mimeType, sizeBytes, contentBase64 };
  });

  if (totalBytes > MAX_TOTAL_UPLOAD_BYTES) {
    const error = new Error('Total upload size exceeds 20MB.');
    error.code = 'DOCUMENT_TOTAL_TOO_LARGE';
    throw error;
  }

  const docsSet = new Set(normalized.map((doc) => doc.docType));
  const missingBase = [...REQUIRED_DOC_TYPES].filter((docType) => !docsSet.has(docType));
  if (missingBase.length > 0) {
    const error = new Error(`Missing required uploads: ${missingBase.join(', ')}`);
    error.code = 'DOCUMENT_REQUIRED_MISSING';
    throw error;
  }
  if (coverType === 'comprehensive') {
    const missingComp = [...REQUIRED_COMPREHENSIVE_DOC_TYPES].filter(
      (docType) => !docsSet.has(docType),
    );
    if (missingComp.length > 0) {
      const error = new Error(`Missing comprehensive uploads: ${missingComp.join(', ')}`);
      error.code = 'DOCUMENT_REQUIRED_MISSING';
      throw error;
    }
  }

  return normalized;
};

const buildHtmlSummary = (payload, referenceNumber, uploadedDocuments) => {
  const docsList = uploadedDocuments.map((doc) => `<li>${doc.docType}: ${doc.filename}</li>`).join('');
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
      <h2 style="margin-bottom:8px">New Motor Insurance Submission</h2>
      <p><strong>Reference:</strong> ${referenceNumber}</p>
      <p><strong>Cover Type:</strong> ${payload.coverType}</p>
      <p><strong>Applicant:</strong> ${payload.applicant.fullName || 'N/A'}</p>
      <p><strong>Email:</strong> ${payload.applicant.email || 'N/A'}</p>
      <p><strong>Phone:</strong> ${cleanPhone(payload.applicant.phone) || 'N/A'}</p>
      <p><strong>Vehicle:</strong> ${payload.applicant.vehicleMakeModel || 'N/A'}</p>
      <p><strong>Reg Number:</strong> ${payload.applicant.vehicleRegNo || 'N/A'}</p>
      <p><strong>Car Value:</strong> ${payload.carValue ? `₦${Number(payload.carValue).toLocaleString()}` : 'N/A'}</p>
      <p><strong>Expected Premium:</strong> ₦${Number(payload.expectedPremium || 0).toLocaleString()}</p>
      <p><strong>Amount Paid:</strong> ₦${Number(payload.amountPaid || 0).toLocaleString()}</p>
      <p><strong>Payment Reference:</strong> ${payload.paymentReference || 'N/A'}</p>
      <p><strong>Uploaded Documents:</strong></p>
      <ul>${docsList || '<li>None</li>'}</ul>
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

  if (!payload?.coverType || !payload?.applicant?.fullName || !payload?.applicant?.email) {
    return jsonResponse(400, { error: 'Missing required motor insurance details.' });
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
    const uploadedDocuments = normalizeUploadedDocuments(
      payload.uploadedDocuments,
      payload.coverType,
    );

    const persisted = await persistence.createApplication({
      publicRef: referenceNumber,
      applicantFullName: payload.applicant.fullName,
      email: payload.applicant.email,
      phone: cleanPhone(payload.applicant.phone),
      productType: 'motor',
      payloadJson: payload,
      paymentReference: payload.paymentReference || null,
      paymentAmount: payload.amountPaid || null,
      status: 'submitted',
    });

    await persistence.addDocuments(
      persisted.id,
      uploadedDocuments.map((doc) => ({
        ...doc,
        storageBucket: null,
        storagePath: null,
      })),
    );

    const resend = new Resend(apiKey);
    const sendResult = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: payload.applicant.email || undefined,
      subject: `New Motor Insurance ${referenceNumber}`,
      html: buildHtmlSummary(payload, referenceNumber, uploadedDocuments),
      attachments: uploadedDocuments.map((doc) => ({
        filename: doc.filename,
        content: doc.contentBase64,
        contentType: doc.mimeType,
      })),
    });

    if (sendResult?.error) {
      const error = new Error(sendResult.error.message || 'Resend rejected the email request.');
      error.code = 'RESEND_SEND_FAILED';
      throw error;
    }

    await persistence.addEvent(persisted.id, 'emailed', {
      toEmail,
      referenceNumber,
      uploadedDocumentCount: uploadedDocuments.length,
    });

    return jsonResponse(200, { referenceNumber });
  } catch (error) {
    const normalized = normalizeError(error);

    if (
      normalized.code === 'DOCUMENT_REQUIRED_MISSING' ||
      normalized.code === 'DOCUMENT_FIELDS_MISSING' ||
      normalized.code === 'DOCUMENT_TYPE_NOT_ALLOWED' ||
      normalized.code === 'DOCUMENT_TOO_LARGE' ||
      normalized.code === 'DOCUMENT_TOTAL_TOO_LARGE'
    ) {
      return jsonResponse(400, { error: normalized.message });
    }

    if (
      normalized.code === 'SUPABASE_CONFIG_MISSING' ||
      normalized.code === 'SUPABASE_INSERT_FAILED' ||
      normalized.code === 'SUPABASE_EMPTY_INSERT_RESULT'
    ) {
      return jsonResponse(503, { error: `Submission persistence error: ${normalized.message}` });
    }

    if (normalized.code === 'RESEND_SEND_FAILED' || normalized.code.includes('resend')) {
      return jsonResponse(502, { error: `Email submission failed: ${normalized.message}` });
    }

    return jsonResponse(500, { error: `Motor submission failed: ${normalized.message}` });
  }
};

