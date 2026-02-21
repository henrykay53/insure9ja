import { useState } from 'react';
import type  { ApplicationData } from './ApplicationFlow';
import { FileCheck, Edit2 } from 'lucide-react';

interface Step9ReviewSubmitProps {
  data: ApplicationData;
  onEdit: (step: number) => void;
  onBack: () => void;
  onComplete: (referenceNumber: string) => void;
}

export function Step9ReviewSubmit({ data, onEdit, onBack, onComplete }: Step9ReviewSubmitProps) {
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [digitalSignature, setDigitalSignature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!declarationChecked) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    
    // Here you would typically submit to your backend
    console.log('Application submitted:', { ...data, digitalSignature });
    
    // Generate a reference number and call completion callback
    const referenceNumber = `INS-${Date.now().toString().slice(-8)}`;
    onComplete(referenceNumber);
  };

  // Calculate estimated annual premium based on plan type
  const getEstimatedPremium = () => {
    const coverage = parseInt(data.coverageAmount.replace(/[^0-9]/g, '')) || 0;
    
    if (data.goal === 'refundable') {
      return Math.round(coverage * 0.05); // 5% of coverage
    } else if (data.goal === 'non-refundable') {
      return Math.round(coverage * 0.03); // 3% of coverage
    } else if (data.goal === 'annuity') {
      return Math.round(coverage * 0.04); // 4% of coverage
    }
    return 0;
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
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
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
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
                <span className="text-sm font-medium text-gray-700">Estimated Annual Premium</span>
                <span className="text-xl font-semibold text-gray-900">
                  {formatCurrency(getEstimatedPremium())}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Final premium will be calculated after underwriting
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Personal Information */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            <button
              onClick={() => onEdit(data.goal === 'refundable' ? 5 : 4)}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
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
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
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
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
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
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
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

        {/* Declaration Section */}
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={declarationChecked}
                onChange={(e) => setDeclarationChecked(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-2 cursor-pointer mt-0.5 flex-shrink-0"
              />
              <span className="text-sm text-gray-700">
                I confirm that the information provided is true and correct to the best of my knowledge. I understand that any false information may result in the rejection of my application or cancellation of my policy.
              </span>
            </label>
          </div>
        </div>

        {/* Digital Signature (Optional) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Digital Signature <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={digitalSignature}
            onChange={(e) => setDigitalSignature(e.target.value)}
            placeholder="Type your full name"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
          />
          <p className="text-xs text-gray-500 mt-2">
            By typing your name, you are providing a digital signature for this application.
          </p>
        </div>
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
          disabled={!declarationChecked || isSubmitting}
          className={`px-8 py-3 rounded-xl transition-all flex items-center gap-2 ${
            declarationChecked && !isSubmitting
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