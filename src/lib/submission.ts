import type { ApplicationData } from '@/components/application/ApplicationFlow';

export interface SubmissionPayload {
  data: ApplicationData;
  digitalSignature: string;
  quoteLabel: string;
  quoteAmount: number;
}

export interface SubmissionResult {
  referenceNumber: string;
}

export async function submitApplication(payload: SubmissionPayload): Promise<SubmissionResult> {
  const abortController = new AbortController();
  const timeoutId = window.setTimeout(() => abortController.abort(), 25000);

  let response: Response;
  try {
    response = await fetch('/.netlify/functions/submit-application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: abortController.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(
        'Submission timed out. Please try again in a few moments.',
      );
    }
    throw new Error(
      'A network error occurred while submitting. Please check your connection and retry.',
    );
  } finally {
    window.clearTimeout(timeoutId);
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      result?.error ||
      'We could not submit your application at this time. Please try again.';
    throw new Error(message);
  }

  if (!result?.referenceNumber) {
    throw new Error('Submission completed but no reference number was returned.');
  }

  return {
    referenceNumber: result.referenceNumber as string,
  };
}
