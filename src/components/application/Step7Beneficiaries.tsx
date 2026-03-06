import { useRef } from 'react';
import type { ApplicationData, Beneficiary } from './ApplicationFlow';
import { Trash2, Plus, Users } from 'lucide-react';
import { DateDropdownInput } from './DateDropdownInput';
import { getTodayIsoDate } from './dateRules';

interface Step7BeneficiariesProps {
  data: ApplicationData;
  onUpdate: (updates: Partial<ApplicationData>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function Step7Beneficiaries({ data, onUpdate, onContinue, onBack }: Step7BeneficiariesProps) {
  const beneficiaries = data.beneficiaries || [];
  const nextBeneficiaryIdRef = useRef(beneficiaries.length + 1);
  const maxDate = getTodayIsoDate();

  const addBeneficiary = () => {
    const newBeneficiary: Beneficiary = {
      id: `beneficiary-${nextBeneficiaryIdRef.current}`,
      fullName: '',
      relationship: '',
      dateOfBirth: '',
      phoneNumber: '',
      percentage: 0,
    };
    nextBeneficiaryIdRef.current += 1;
    onUpdate({ beneficiaries: [...beneficiaries, newBeneficiary] });
  };

  const updateBeneficiary = (id: string, updates: Partial<Beneficiary>) => {
    const updatedBeneficiaries = beneficiaries.map((b) =>
      b.id === id ? { ...b, ...updates } : b
    );
    onUpdate({ beneficiaries: updatedBeneficiaries });
  };

  const removeBeneficiary = (id: string) => {
    const updatedBeneficiaries = beneficiaries.filter((b) => b.id !== id);
    onUpdate({ beneficiaries: updatedBeneficiaries });
  };

  const calculateTotalPercentage = () => {
    return beneficiaries.reduce((sum, b) => sum + (Number(b.percentage) || 0), 0);
  };

  const totalPercentage = calculateTotalPercentage();
  const isValidTotal = totalPercentage === 100;
  const hasMinimumInfo = beneficiaries.length > 0 && beneficiaries.every(
    (b) => b.fullName && b.relationship && b.dateOfBirth && b.percentage > 0
  );

  const isValid = isValidTotal && hasMinimumInfo;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl text-gray-900 mb-2">
              Beneficiaries
            </h2>
            <p className="text-sm text-gray-600">
              Tell us who should receive the benefit if anything happens to you.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              You can add more than one beneficiary.
            </p>
          </div>
        </div>

        {/* Beneficiary Cards */}
        <div className="space-y-6 mb-6">
          {beneficiaries.map((beneficiary, index) => (
            <div
              key={beneficiary.id}
              className="border border-gray-200 rounded-xl p-5 bg-gray-50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-gray-700">
                  Beneficiary {index + 1}
                </div>
                {beneficiaries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBeneficiary(beneficiary.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={beneficiary.fullName}
                    onChange={(e) =>
                      updateBeneficiary(beneficiary.id, { fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
                    placeholder="Enter full name"
                  />
                </div>

                {/* Relationship and Percentage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship
                    </label>
                    <select
                      value={beneficiary.relationship}
                      onChange={(e) =>
                        updateBeneficiary(beneficiary.id, { relationship: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
                    >
                      <option value="">Select relationship</option>
                      <option value="spouse">Spouse</option>
                      <option value="child">Child</option>
                      <option value="parent">Parent</option>
                      <option value="sibling">Sibling</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Percentage share (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={beneficiary.percentage || ''}
                      onChange={(e) =>
                        updateBeneficiary(beneficiary.id, {
                          percentage: Math.min(100, Math.max(0, Number(e.target.value))),
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of birth
                  </label>
                  <DateDropdownInput
                    idPrefix={`${beneficiary.id}-dob`}
                    value={beneficiary.dateOfBirth}
                    onChange={(value) => updateBeneficiary(beneficiary.id, { dateOfBirth: value })}
                    max={maxDate}
                    min="1920-01-01"
                  />
                </div>

                {/* Phone Number (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone number <span className="text-gray-400">(optional)</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 flex-shrink-0">
                      +234
                    </div>
                    <input
                      type="tel"
                      value={beneficiary.phoneNumber}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[^\d\s]/g, '');
                        updateBeneficiary(beneficiary.id, { phoneNumber: cleaned });
                      }}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
                      placeholder="8012345678"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Beneficiary Button */}
        <button
          type="button"
          onClick={addBeneficiary}
          className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add another beneficiary
        </button>

        {/* Percentage Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total allocation:</span>
            <span
              className={`text-2xl font-semibold ${
                isValidTotal
                  ? 'text-green-600'
                  : totalPercentage > 100
                  ? 'text-red-600'
                  : 'text-gray-900'
              }`}
            >
              {totalPercentage}%
            </span>
          </div>
          {!isValidTotal && (
            <p
              className={`text-sm mt-2 ${
                totalPercentage > 100 ? 'text-red-600' : 'text-gray-500'
              }`}
            >
              {totalPercentage > 100
                ? 'Total percentage cannot exceed 100%'
                : 'Total percentage must equal 100%'}
            </p>
          )}
          {isValidTotal && (
            <p className="text-sm mt-2 text-green-600 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-xs">
                ✓
              </span>
              Allocation complete
            </p>
          )}
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
