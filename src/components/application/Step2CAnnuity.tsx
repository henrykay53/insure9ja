import type { ApplicationData } from './ApplicationFlow';
import { Info } from 'lucide-react';
import { useState } from 'react';
import { DateDropdownInput } from './DateDropdownInput';
import { getTodayIsoDate, isDobOnOrBeforeToday } from './dateRules';
import { QuoteCaveat } from './QuoteCaveat';
import { getAnnuityPayout } from '@/lib/quotation';

interface Step2CAnnuityProps {
  data: ApplicationData;
  onUpdate: (updates: Partial<ApplicationData>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function Step2CAnnuity({ data, onUpdate, onContinue, onBack }: Step2CAnnuityProps) {
  const [showRsaTooltip, setShowRsaTooltip] = useState(false);
  const today = getTodayIsoDate();

  // Calculate estimated monthly income based on contribution
  const payout = getAnnuityPayout(data.coverageAmount, data.dateOfBirth, data.annuityOption);
  const estimatedIncome = payout.monthly;

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    onUpdate({ coverageAmount: formatted });
  };

  const hasValidDob = isDobOnOrBeforeToday(data.dateOfBirth);
  const isValid = Boolean(data.coverageAmount && data.dateOfBirth && hasValidDob);

  const getAmountLabel = () => {
    if (data.annuityOption === 'pfa') return 'What is your RSA balance?';
    if (data.annuityOption === 'lump-sum') {
      return 'What one-off amount do you want to pay?';
    }
    return 'How much do you want to contribute?';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
        <h2 className="text-2xl sm:text-3xl text-gray-900 mb-8">
          Annuity plan
        </h2>

        <div className="space-y-6 mb-8">
          {/* Contribution/RSA Amount */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label htmlFor="contribution" className="block text-sm font-medium text-gray-700">
                {getAmountLabel()}
              </label>
              {data.annuityOption === 'pfa' && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowRsaTooltip((prev) => !prev)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Explain RSA balance"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showRsaTooltip && (
                    <div className="absolute z-10 left-0 top-6 w-64 rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-600 shadow-lg">
                      RSA means Retirement Savings Account balance, which is your retirement fund
                      managed by your PFA.
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
              <input
                type="text"
                id="contribution"
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
              min="1920-01-01"
              max={today}
              onChange={(value) => onUpdate({ dateOfBirth: value })}
            />
            {data.dateOfBirth && !hasValidDob && (
              <p className="text-sm text-red-600 mt-2">
                Date of birth cannot be in the future.
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Income Summary */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Estimated regular monthly payout for life</div>
              <div className="text-3xl font-semibold text-gray-900">
                ₦{estimatedIncome.toLocaleString()}
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
