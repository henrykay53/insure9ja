import { useState } from 'react';
import type  { ApplicationData } from './ApplicationFlow';
import { FileCheck, Edit2 } from 'lucide-react';
import { QuoteCaveat } from './QuoteCaveat';
import { getAnnuityPayout, getNonRefundablePremium, getRefundablePremium } from '@/lib/quotation';
import type { UploadedDocumentPayload } from '@/lib/submission';
import { submitApplication } from '@/lib/submission';

interface Step9ReviewSubmitProps {
  data: ApplicationData;
  onEdit: (step: number) => void;
  onBack: () => void;
  onComplete: (referenceNumber: string) => void;
}

type RequiredDocKey = 'payment_receipt' | 'valid_id' | 'utility_bill' | 'passport_photo';

const REQUIRED_DOCUMENTS: Array<{
  key: RequiredDocKey;
  label: string;
  hint: string;
  accept: string;
}> = [
  {
    key: 'payment_receipt',
    label: 'Payment receipt',
    hint: 'Upload transfer receipt (PDF/JPG/PNG, max 4MB)',
    accept: '.pdf,.jpg,.jpeg,.png',
  },
  {
    key: 'valid_id',
    label: 'Valid means of ID',
    hint: 'National ID, passport, voters card, or drivers licence',
    accept: '.pdf,.jpg,.jpeg,.png',
  },
  {
    key: 'utility_bill',
    label: 'Utility bill',
    hint: 'Recent utility bill document',
    accept: '.pdf,.jpg,.jpeg,.png',
  },
  {
    key: 'passport_photo',
    label: 'Passport photo',
    hint: 'Clear passport-style photo (JPG/PNG)',
    accept: '.jpg,.jpeg,.png',
  },
];

const ACCOUNT_DETAILS = [
  { bank: 'GT Bank', accountNumber: '0003033066' },
  { bank: 'Zenith Bank', accountNumber: '1011564309' },
  { bank: 'First Bank', accountNumber: '2003014725' },
];

export function Step9ReviewSubmit({ data, onEdit, onBack, onComplete }: Step9ReviewSubmitProps) {
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [digitalSignature, setDigitalSignature] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [documentFiles, setDocumentFiles] = useState<Record<RequiredDocKey, File | null>>({
    payment_receipt: null,
    valid_id: null,
    utility_bill: null,
    passport_photo: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const hasValidSignature = digitalSignature.trim().length > 1;
  const hasValidPaymentReference = paymentReference.trim().length > 2;
  const parsedPaymentAmount = Number(paymentAmount.replace(/,/g, '').trim());
  const hasValidPaymentAmount = Number.isFinite(parsedPaymentAmount) && parsedPaymentAmount > 0;
  const allRequiredDocsPresent = REQUIRED_DOCUMENTS.every((doc) => documentFiles[doc.key]);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || '');
        const [, base64 = ''] = result.split(',');
        resolve(base64);
      };
      reader.onerror = () => reject(new Error(`Could not read file ${file.name}`));
      reader.readAsDataURL(file);
    });

  const handleDocumentChange = (key: RequiredDocKey, file: File | null) => {
    setDocumentFiles((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  const toUploadedDocumentsPayload = async (): Promise<UploadedDocumentPayload[]> => {
    const items = await Promise.all(
      REQUIRED_DOCUMENTS.map(async (doc) => {
        const file = documentFiles[doc.key];
        if (!file) {
          throw new Error(`Please upload ${doc.label.toLowerCase()}.`);
        }
        const sizeLimit = 4 * 1024 * 1024;
        if (file.size > sizeLimit) {
          throw new Error(`${doc.label} exceeds 4MB. Please upload a smaller file.`);
        }
        const contentBase64 = await fileToBase64(file);
        return {
          docType: doc.key,
          filename: file.name,
          mimeType: file.type || 'application/octet-stream',
          contentBase64,
        };
      }),
    );
    return items;
  };

  const handleSubmit = async () => {
    if (!declarationChecked || !hasValidSignature || !hasValidPaymentReference || !hasValidPaymentAmount) return;
    
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const uploadedDocuments = await toUploadedDocumentsPayload();
      const result = await submitApplication({
        data,
        digitalSignature: digitalSignature.trim(),
        quoteLabel: quote.label,
        quoteAmount: quote.amount,
        paymentReference: paymentReference.trim(),
        paymentAmount: parsedPaymentAmount,
        uploadedDocuments,
      });
      onComplete(result.referenceNumber);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'We could not submit your application. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getQuote = () => {
    if (data.goal === 'refundable') {
      return {
        label: 'Estimated annual premium',
        amount: getRefundablePremium(data.coverageAmount, data.dateOfBirth, data.refundSchedule),
      };
    }
    if (data.goal === 'non-refundable') {
      return {
        label: 'Estimated annual premium',
        amount: getNonRefundablePremium(data.coverageAmount, data.dateOfBirth),
      };
    }
    if (data.goal === 'annuity') {
      const payout = getAnnuityPayout(data.coverageAmount, data.dateOfBirth, data.annuityOption);
      return {
        label: 'Estimated annual payout',
        amount: payout.annual,
      };
    }
    return {
      label: 'Estimated annual premium',
      amount: 0,
    };
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const quote = getQuote();

  const maskString = (str: string) => {
    if (!str || str.length < 4) return str;
    return '•'.repeat(str.length - 4) + str.slice(-4);
  };

  const getEditStep = () => {
    // Returns the step number for plan configuration based on goal type
    if (data.goal === 'refundable') return 3;
    return 2;
  };

  const getPlanTypeName = () => {
    if (data.goal === 'refundable') return 'Refundable Premium Life Insurance';
    if (data.goal === 'non-refundable') return 'Non-Refundable Premium Life Insurance';
    if (data.goal === 'annuity') return 'Annuity Plan';
    return 'Life Insurance';
  };

  const getRefundStructure = () => {
    if (data.goal === 'refundable') {
      if (data.refundSchedule === '5-years') return '5 Years';
      if (data.refundSchedule === '3-years-9') return '3 Years (9 months waiting)';
    }
    return 'N/A';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6 animate-scale-in-soft">
        <div className="flex items-start gap-3 mb-8">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileCheck className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl text-gray-900 mb-2">
              Review Your Application
            </h2>
            <p className="text-sm text-gray-600">
              Please review all information before submitting your application.
            </p>
          </div>
        </div>

        {/* Section 1: Plan Summary */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Plan Summary</h3>
            <button
              onClick={() => onEdit(getEditStep())}
              disabled={isSubmitting}
              className="text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Plan Type</span>
              <span className="text-sm font-medium text-gray-900 text-right">{getPlanTypeName()}</span>
            </div>
            {data.goal === 'refundable' && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600">Refund Structure</span>
                <span className="text-sm font-medium text-gray-900">{getRefundStructure()}</span>
              </div>
            )}
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Coverage Amount</span>
              <span className="text-sm font-medium text-gray-900">{data.coverageAmount}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Policy Term</span>
              <span className="text-sm font-medium text-gray-900">
                {data.payMonthlyForLife ? 'Lifetime' : 'Fixed Term'}
              </span>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-700">{quote.label}</span>
                <span className="text-xl font-semibold text-gray-900">
                  {formatCurrency(quote.amount)}
                </span>
              </div>
              <QuoteCaveat />
            </div>
          </div>
        </div>

        {/* Section 2: Personal Information */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            <button
              onClick={() => onEdit(data.goal === 'refundable' ? 5 : 4)}
              disabled={isSubmitting}
              className="text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Full Name</span>
              <span className="text-sm font-medium text-gray-900">{data.firstName} {data.lastName}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Phone</span>
              <span className="text-sm font-medium text-gray-900">+234{data.phoneNumber}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Email</span>
              <span className="text-sm font-medium text-gray-900">{data.email}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Date of Birth</span>
              <span className="text-sm font-medium text-gray-900">
                {data.personalDOB ? new Date(data.personalDOB).toLocaleDateString('en-GB') : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Identity */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Identity Verification</h3>
            <button
              onClick={() => onEdit(data.goal === 'refundable' ? 6 : 5)}
              disabled={isSubmitting}
              className="text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 space-y-3">
            {data.bvn && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600">BVN</span>
                <span className="text-sm font-medium text-gray-900 font-mono">{maskString(data.bvn)}</span>
              </div>
            )}
            {data.nin && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600">NIN</span>
                <span className="text-sm font-medium text-gray-900 font-mono">{maskString(data.nin)}</span>
              </div>
            )}
            {data.idType && (
              <>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">ID Type</span>
                  <span className="text-sm font-medium text-gray-900">{data.idType}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">ID Number</span>
                  <span className="text-sm font-medium text-gray-900 font-mono">{maskString(data.idNumber)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 4: Beneficiaries */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Beneficiaries</h3>
            <button
              onClick={() => onEdit(data.goal === 'refundable' ? 7 : 6)}
              disabled={isSubmitting}
              className="text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 space-y-4">
            {data.beneficiaries && data.beneficiaries.length > 0 ? (
              <>
                {data.beneficiaries.map((beneficiary) => (
                  <div key={beneficiary.id} className="pb-3 border-b border-gray-200 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{beneficiary.fullName}</p>
                        <p className="text-xs text-gray-600 capitalize">{beneficiary.relationship}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{beneficiary.percentage}%</span>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Allocation</span>
                    <span className="text-sm font-semibold text-green-600">100%</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">No beneficiaries added</p>
            )}
          </div>
        </div>

        {/* Section 5: Health Summary */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Health Summary</h3>
            <button
              onClick={() => onEdit(data.goal === 'refundable' ? 8 : 7)}
              disabled={isSubmitting}
              className="text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Serious medical condition</span>
              <span className="text-sm font-medium text-gray-900">
                {data.hasMedicalCondition ? 'Yes' : 'No'}
              </span>
            </div>
            {data.hasMedicalCondition && data.medicalConditions && data.medicalConditions.length > 0 && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600">Conditions</span>
                <span className="text-sm font-medium text-gray-900 text-right">
                  {data.medicalConditions.join(', ')}
                  {data.otherCondition && `, ${data.otherCondition}`}
                </span>
              </div>
            )}
            {data.height && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600">Height</span>
                <span className="text-sm font-medium text-gray-900">{data.height} cm</span>
              </div>
            )}
            {data.weight && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600">Weight</span>
                <span className="text-sm font-medium text-gray-900">{data.weight} kg</span>
              </div>
            )}
            {data.hobby && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600">Hobby</span>
                <span className="text-sm font-medium text-gray-900 text-right">{data.hobby}</span>
              </div>
            )}
            {data.pregnant !== undefined && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600">Pregnant</span>
                <span className="text-sm font-medium text-gray-900">
                  {data.pregnant ? 'Yes' : 'No'}
                </span>
              </div>
            )}
            {data.smokes !== undefined && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600">Smoker</span>
                <span className="text-sm font-medium text-gray-900">
                  {data.smokes ? 'Yes' : 'No'}
                </span>
              </div>
            )}
            {data.onMedication !== undefined && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600">Currently on medication</span>
                <span className="text-sm font-medium text-gray-900">
                  {data.onMedication ? 'Yes' : 'No'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Section 6: Payment Details */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="rounded-xl bg-white border border-gray-200 p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Account Name</p>
              <p className="text-base font-medium text-gray-900">Custodian and Allied Insurance Limited</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {ACCOUNT_DETAILS.map((account) => (
                <div key={account.bank} className="rounded-xl bg-white border border-gray-200 p-3">
                  <p className="text-xs text-gray-600 mb-1">{account.bank}</p>
                  <p className="text-sm font-semibold text-gray-900">{account.accountNumber}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment reference <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="Enter transfer reference"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount paid (₦) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="e.g. 120000"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 7: Document Uploads */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Uploads</h3>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-4">
            {REQUIRED_DOCUMENTS.map((doc) => (
              <div key={doc.key} className="rounded-xl bg-white border border-gray-200 p-4">
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  {doc.label} <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">{doc.hint}</p>
                <input
                  type="file"
                  accept={doc.accept}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleDocumentChange(doc.key, file);
                  }}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-gray-800"
                />
                {documentFiles[doc.key] && (
                  <p className="text-xs text-gray-600 mt-2">
                    Selected: {documentFiles[doc.key]?.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Declaration Section */}
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={declarationChecked}
                onChange={(e) => setDeclarationChecked(e.target.checked)}
                disabled={isSubmitting}
                className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-2 cursor-pointer mt-0.5 flex-shrink-0"
              />
              <span className="text-sm text-gray-700">
                I confirm that the information provided is true and correct to the best of my knowledge. I understand that any false information may result in the rejection of my application or cancellation of my policy.
              </span>
            </label>
          </div>
        </div>

        {/* Digital Signature */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Digital Signature <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={digitalSignature}
            onChange={(e) => setDigitalSignature(e.target.value)}
            placeholder="Type your full name"
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
          />
          <p className="text-xs text-gray-500 mt-2">
            By typing your name, you are providing a digital signature for this application.
          </p>
        </div>

        {isSubmitting && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 animate-fade-up">
            <p className="text-sm text-blue-800">
              Submitting your application securely. Please keep this page open.
            </p>
          </div>
        )}

        {submitError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 animate-fade-up">
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className={`px-6 py-3 rounded-xl transition-colors ${
            isSubmitting ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={
            !declarationChecked ||
            !hasValidSignature ||
            !hasValidPaymentReference ||
            !hasValidPaymentAmount ||
            !allRequiredDocsPresent ||
            isSubmitting
          }
          className={`px-8 py-3 rounded-xl transition-all flex items-center gap-2 ${
            declarationChecked &&
            hasValidSignature &&
            hasValidPaymentReference &&
            hasValidPaymentAmount &&
            allRequiredDocsPresent &&
            !isSubmitting
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </div>
  );
}
