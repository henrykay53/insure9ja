import type { UploadedDocumentPayload } from './submission';

interface MotorApplicant {
  fullName: string;
  email: string;
  phone: string;
  vehicleMakeModel?: string;
  vehicleRegNo?: string;
}

export interface MotorSubmissionPayload {
  coverType: 'third-party' | 'comprehensive';
  carValue: number | null;
  expectedPremium: number;
  amountPaid: number;
  paymentReference: string;
  digitalSignature: string;
  applicant: MotorApplicant;
  uploadedDocuments: UploadedDocumentPayload[];
}

export interface MotorSubmissionResult {
  referenceNumber: string;
}

export async function submitMotorInsurance(
  payload: MotorSubmissionPayload,
): Promise<MotorSubmissionResult> {
  const response = await fetch('/.netlify/functions/submit-motor-insurance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      result?.error || 'We could not submit motor insurance details right now.',
    );
  }

  if (!result?.referenceNumber) {
    throw new Error('Submission completed but no reference number was returned.');
  }

  return { referenceNumber: result.referenceNumber as string };
}
