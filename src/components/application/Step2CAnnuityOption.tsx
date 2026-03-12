import { Info } from 'lucide-react';
import { useState } from 'react';

export type AnnuityOption = 'pfa' | 'lump-sum' | 'deferred' | null;

interface Step2CAnnuityOptionProps {
  selectedOption: AnnuityOption;
  onSelectOption: (option: AnnuityOption) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function Step2CAnnuityOption({
  selectedOption,
  onSelectOption,
  onContinue,
  onBack,
}: Step2CAnnuityOptionProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const options = [
    {
      id: 'pfa' as AnnuityOption,
      title: "I'm retiring and have a pension fund (PFA)",
      description: 'Use this option if your pension savings are managed by a Pension Fund Administrator.',
      hasTooltip: true,
    },
    {
      id: 'lump-sum' as AnnuityOption,
      title: 'I want regular monthly payout for life',
      description: 'Use this option if you want to pay a one-off amount and receive regular monthly payout for life.',
      hasTooltip: false,
    },
    {
      id: 'deferred' as AnnuityOption,
      title: 'I want to build towards future retirement income',
      description: 'Choose this option if you want to accumulate funds now and start receiving income later.',
      hasTooltip: false,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl text-gray-900 mb-3">
            How would you like to set up your annuity?
          </h2>
          <p className="text-sm text-gray-600">
            Select the option that best describes your current situation.
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-6">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              className={`w-full text-left p-5 sm:p-6 rounded-xl border-2 transition-all ${
                selectedOption === option.id
                  ? 'border-gray-900 bg-gray-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Radio Circle */}
                <div className="flex-shrink-0 mt-0.5">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedOption === option.id
                        ? 'border-gray-900 bg-gray-900'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedOption === option.id && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="text-base font-semibold text-gray-900 flex-1">
                      {option.title}
                    </h3>
                    {option.hasTooltip && (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowTooltip(!showTooltip);
                          }}
                          onBlur={() => setTimeout(() => setShowTooltip(false), 200)}
                          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                          <Info className="w-5 h-5" />
                        </button>
                        
                        {/* Tooltip */}
                        {showTooltip && (
                          <div className="absolute z-10 right-0 top-8 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                            <div className="mb-2">
                              <p className="text-sm font-semibold text-gray-900">
                                What is a PFA?
                              </p>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              A Pension Fund Administrator (PFA) manages your retirement savings under Nigeria's pension system. Choose this option if you are converting your pension savings into an annuity.
                            </p>
                            <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Mobile Tooltip Modal */}
        {showTooltip && (
          <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
            <div className="bg-white rounded-t-2xl w-full p-6 animate-slide-up">
              <div className="mb-4">
                <p className="text-base font-semibold text-gray-900">
                  What is a PFA?
                </p>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                A Pension Fund Administrator (PFA) manages your retirement savings under Nigeria's pension system. Choose this option if you are converting your pension savings into an annuity.
              </p>
              <button
                onClick={() => setShowTooltip(false)}
                className="w-full py-3 px-4 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        )}
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
          disabled={!selectedOption}
          className={`px-8 py-3 rounded-xl transition-colors ${
            selectedOption
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
