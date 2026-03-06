import type { ApplicationData } from './ApplicationFlow';
import { DateDropdownInput } from './DateDropdownInput';
import { getProtectionMinDobIso, getTodayIsoDate, isProtectionDobValid } from './dateRules';
import { QuoteCaveat } from './QuoteCaveat';
import { getRefundablePremium } from '@/lib/quotation';

interface Step3ARefund5YearsProps {
  data: ApplicationData;
  onUpdate: (updates: Partial<ApplicationData>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function Step3ARefund5Years({ data, onUpdate, onContinue, onBack }: Step3ARefund5YearsProps) {
  const protectionMinDob = getProtectionMinDobIso();
  const today = getTodayIsoDate();

  // Calculate estimated premium based on coverage amount and age
  const estimatedPremium = getRefundablePremium(data.coverageAmount, data.dateOfBirth, '5-years');

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    onUpdate({ coverageAmount: formatted });
  };

  const hasValidAge = isProtectionDobValid(data.dateOfBirth);
  const isValid = Boolean(data.coverageAmount && data.dateOfBirth && hasValidAge);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
        <h2 className="text-2xl sm:text-3xl text-gray-900 mb-8">
          Refund after 5 years
        </h2>

        <div className="space-y-6 mb-8">
          {/* Coverage Amount */}
          <div>
            <label htmlFor="coverage" className="block text-sm font-medium text-gray-700 mb-2">
              Amount your children should receive if anything happens to you
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
              <input
                type="text"
                id="coverage"
                value={data.coverageAmount}
                onChange={handleAmountChange}
                placeholder="0"
                className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 focus:outline-none text-lg"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
              Date of birth
            </label>
            <DateDropdownInput
              idPrefix="dob"
              value={data.dateOfBirth}
              min={protectionMinDob}
              max={today}
              onChange={(value) => onUpdate({ dateOfBirth: value })}
            />
            {data.dateOfBirth && !hasValidAge && (
              <p className="text-sm text-red-600 mt-2">
                Entry age for this protection plan is up to 60 years.
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Premium Summary */}
        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Estimated annual premium</div>
              <div className="text-3xl font-semibold text-gray-900">
                ₦{estimatedPremium.toLocaleString()}
              </div>
            </div>
          </div>
          <QuoteCaveat />
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
