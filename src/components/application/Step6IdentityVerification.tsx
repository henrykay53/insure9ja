import { useState } from 'react';
import type { ApplicationData } from './ApplicationFlow';
import { Shield, ChevronDown, ChevronUp } from 'lucide-react';

interface Step6IdentityVerificationProps {
  data: ApplicationData;
  onUpdate: (updates: Partial<ApplicationData>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function Step6IdentityVerification({ data, onUpdate, onContinue, onBack }: Step6IdentityVerificationProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showOptionalId, setShowOptionalId] = useState(false);

  const validateBVN = (bvn: string) => {
    const cleaned = bvn.replace(/\s/g, '');
    return cleaned.length === 11 && /^\d+$/.test(cleaned);
  };

  const validateNIN = (nin: string) => {
    const cleaned = nin.replace(/\s/g, '');
    return cleaned.length === 11 && /^\d+$/.test(cleaned);
  };

  const handleBVNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    onUpdate({ bvn: value });
    
    if (value && !validateBVN(value)) {
      setErrors({ ...errors, bvn: 'BVN must be 11 digits' });
    } else {
      const newErrors = { ...errors };
      delete newErrors.bvn;
      setErrors(newErrors);
    }
  };

  const handleNINChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    onUpdate({ nin: value });
    
    if (value && !validateNIN(value)) {
      setErrors({ ...errors, nin: 'NIN must be 11 digits' });
    } else {
      const newErrors = { ...errors };
      delete newErrors.nin;
      setErrors(newErrors);
    }
  };

  const isValid = 
    data.bvn &&
    validateBVN(data.bvn) &&
    data.nin &&
    validateNIN(data.nin) &&
    Object.keys(errors).length === 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl text-gray-900 mb-2">
              Identity Verification
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We are required to verify your identity to comply with regulatory requirements. Your information is handled securely.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* BVN */}
          <div>
            <label htmlFor="bvn" className="block text-sm font-medium text-gray-700 mb-2">
              Bank Verification Number (BVN)
            </label>
            <input
              type="text"
              id="bvn"
              inputMode="numeric"
              value={data.bvn || ''}
              onChange={handleBVNChange}
              className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                errors.bvn
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900'
              } focus:outline-none focus:ring-1`}
              placeholder="11-digit BVN"
              maxLength={11}
            />
            {errors.bvn && (
              <p className="text-sm text-red-600 mt-1">{errors.bvn}</p>
            )}
            {data.bvn && validateBVN(data.bvn) && (
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-xs">✓</span>
                Valid BVN
              </p>
            )}
          </div>

          {/* NIN */}
          <div>
            <label htmlFor="nin" className="block text-sm font-medium text-gray-700 mb-2">
              National Identification Number (NIN)
            </label>
            <input
              type="text"
              id="nin"
              inputMode="numeric"
              value={data.nin || ''}
              onChange={handleNINChange}
              className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                errors.nin
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900'
              } focus:outline-none focus:ring-1`}
              placeholder="NIN"
              maxLength={11}
            />
            {errors.nin && (
              <p className="text-sm text-red-600 mt-1">{errors.nin}</p>
            )}
            {data.nin && validateNIN(data.nin) && (
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-xs">✓</span>
                Valid NIN
              </p>
            )}
          </div>

          {/* Optional ID Section */}
          <div className="border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={() => setShowOptionalId(!showOptionalId)}
              className="w-full flex items-center justify-between text-left py-2 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                Additional identification (optional)
              </span>
              {showOptionalId ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {showOptionalId && (
              <div className="mt-4 space-y-5 pl-2">
                {/* ID Type */}
                <div>
                  <label htmlFor="idType" className="block text-sm font-medium text-gray-700 mb-2">
                    ID type
                  </label>
                  <select
                    id="idType"
                    value={data.idType || ''}
                    onChange={(e) => onUpdate({ idType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors bg-white"
                  >
                    <option value="">Select ID type</option>
                    <option value="national-id">National ID</option>
                    <option value="passport">International Passport</option>
                    <option value="drivers-license">Driver's License</option>
                    <option value="voters-card">Voter's Card</option>
                  </select>
                </div>

                {/* ID Number */}
                <div>
                  <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    ID number
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    value={data.idNumber || ''}
                    onChange={(e) => onUpdate({ idNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
                    placeholder="Enter ID number"
                  />
                </div>

                {/* Issuing Authority */}
                <div>
                  <label htmlFor="issuingAuthority" className="block text-sm font-medium text-gray-700 mb-2">
                    Issuing authority <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="issuingAuthority"
                    value={data.issuingAuthority || ''}
                    onChange={(e) => onUpdate({ issuingAuthority: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
                    placeholder="e.g., NIMC, FRSC"
                  />
                </div>

                {/* Issue and Expiry Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Issue date
                    </label>
                    <input
                      type="date"
                      id="issueDate"
                      value={data.issueDate || ''}
                      onChange={(e) => onUpdate({ issueDate: e.target.value })}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry date
                    </label>
                    <input
                      type="date"
                      id="expiryDate"
                      value={data.expiryDate || ''}
                      onChange={(e) => onUpdate({ expiryDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={!isValid}
          className={`px-8 py-3 rounded-xl transition-colors ${
            isValid
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
