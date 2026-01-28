import { Check } from 'lucide-react';
import type { RefundSchedule } from './ApplicationFlow';

interface Step2ARefundScheduleProps {
  selectedSchedule: RefundSchedule;
  onSelectSchedule: (schedule: RefundSchedule) => void;
  onContinue: () => void;
  onBack: () => void;
}

const schedules = [
  {
    id: '5-years' as RefundSchedule,
    title: 'Refund after 5 years',
  },
  {
    id: '3-years-9' as RefundSchedule,
    title: 'Refund every 3 years for 9 years',
  },
];

export function Step2ARefundSchedule({
  selectedSchedule,
  onSelectSchedule,
  onContinue,
  onBack,
}: Step2ARefundScheduleProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
        <h2 className="text-2xl sm:text-3xl text-gray-900 mb-8">
          How often do you want refunds?
        </h2>

        <div className="space-y-4">
          {schedules.map((schedule) => (
            <button
              key={schedule.id}
              onClick={() => onSelectSchedule(schedule.id)}
              className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                selectedSchedule === schedule.id
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-medium text-gray-900">{schedule.title}</h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    selectedSchedule === schedule.id
                      ? 'border-gray-900 bg-gray-900'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedSchedule === schedule.id && <Check className="w-4 h-4 text-white" />}
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
          className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={!selectedSchedule}
          className={`px-8 py-3 rounded-xl transition-colors ${
            selectedSchedule
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
