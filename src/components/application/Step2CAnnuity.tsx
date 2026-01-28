import { useState, useEffect } from 'react';
import type { ApplicationData } from './ApplicationFlow';

interface Step2CAnnuityProps {
  data: ApplicationData;
  onUpdate: (updates: Partial<ApplicationData>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function Step2CAnnuity({ data, onUpdate, onContinue, onBack }: Step2CAnnuityProps) {
  const [estimatedIncome, setEstimatedIncome] = useState(0);

  useEffect(() => {
    // Calculate estimated monthly income based on contribution
    const amount = parseFloat(data.coverageAmount.replace(/,/g, '')) || 0;
    if (amount > 0) {
      // Rough estimate: monthly income based on annual contribution
      const monthlyIncome = Math.round((amount * 0.08) / 12 / 1000) * 1000;
      setEstimatedIncome(monthlyIncome);
    } else {
      setEstimatedIncome(0);
    }
  }, [data.coverageAmount, data.dateOfBirth]);

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    onUpdate({ coverageAmount: formatted });
  };

  const isValid = data.coverageAmount && data.dateOfBirth;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
        <h2 className="text-2xl sm:text-3xl text-gray-900 mb-8">
          Annuity plan
        </h2>

        <div className="space-y-6 mb-8">
          {/* Annual Contribution */}
          <div>
            <label htmlFor="contribution" className="block text-sm font-medium text-gray-700 mb-2">
              How much would you like to contribute annually?
            </label>
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
            <input
              type="date"
              id="dob"
              value={data.dateOfBirth}
              onChange={(e) => onUpdate({ dateOfBirth: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 focus:outline-none text-lg"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Income Summary */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Estimated monthly retirement income</div>
              <div className="text-3xl font-semibold text-gray-900">
                ₦{estimatedIncome.toLocaleString()}
              </div>
            </div>
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
