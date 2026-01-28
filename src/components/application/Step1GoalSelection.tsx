import { Check } from 'lucide-react';
import type { GoalType } from './ApplicationFlow';

interface Step1GoalSelectionProps {
  selectedGoal: GoalType;
  onSelectGoal: (goal: GoalType) => void;
  onContinue: () => void;
  onBack: () => void;
}

const goals = [
  {
    id: 'non-refundable' as GoalType,
    title: 'Protect my family at the lowest cost',
    subtitle: 'Non-refundable premium',
  },
  {
    id: 'refundable' as GoalType,
    title: 'Protect my family and get my money back later',
    subtitle: 'Refundable premium',
  },
  {
    id: 'annuity' as GoalType,
    title: 'Pay me monthly during retirement',
    subtitle: 'Annuity plan',
  },
];

export function Step1GoalSelection({
  selectedGoal,
  onSelectGoal,
  onContinue,
  onBack,
}: Step1GoalSelectionProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
        <h2 className="text-2xl sm:text-3xl text-gray-900 mb-8">
          What do you want this plan to do?
        </h2>

        <div className="space-y-4">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => onSelectGoal(goal.id)}
              className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                selectedGoal === goal.id
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {goal.title}
                  </h3>
                  <p className="text-sm text-gray-600">{goal.subtitle}</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    selectedGoal === goal.id
                      ? 'border-gray-900 bg-gray-900'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedGoal === goal.id && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          disabled
          className="px-6 py-3 rounded-xl text-gray-400 cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={!selectedGoal}
          className={`px-8 py-3 rounded-xl transition-colors ${
            selectedGoal
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
