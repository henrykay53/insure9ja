import type { ApplicationData } from './ApplicationFlow';
import { Heart } from 'lucide-react';

interface Step8HealthInformationProps {
  data: ApplicationData;
  onUpdate: (updates: Partial<ApplicationData>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function Step8HealthInformation({ data, onUpdate, onContinue, onBack }: Step8HealthInformationProps) {
  const hasMedicalCondition = data.hasMedicalCondition;
  const selectedConditions = data.medicalConditions || [];
  const otherCondition = data.otherCondition || '';
  const height = data.height || '';
  const weight = data.weight || '';
  const smokes = data.smokes;
  const onMedication = data.onMedication;
  const medicationDetails = data.medicationDetails || '';
  const liveOutsideNigeria = data.liveOutsideNigeria;

  const conditions = [
    'Heart disease',
    'Diabetes',
    'Hypertension',
    'Tuberculosis (TB)',
    'Epilepsy',
    'HIV/AIDS',
  ];

  const toggleCondition = (condition: string) => {
    const updated = selectedConditions.includes(condition)
      ? selectedConditions.filter((c) => c !== condition)
      : [...selectedConditions, condition];
    onUpdate({ medicalConditions: updated });
  };

  const isValid = () => {
    // Gate question must be answered
    if (hasMedicalCondition === undefined || hasMedicalCondition === null) {
      return false;
    }

    // If no medical condition, can proceed
    if (hasMedicalCondition === false) {
      return true;
    }

    // If yes to medical condition, must have at least one condition selected or other filled
    if (hasMedicalCondition === true) {
      const hasCondition = selectedConditions.length > 0 || (otherCondition && otherCondition.trim().length > 0);
      if (!hasCondition) return false;

      // If on medication, must provide details
      if (onMedication === true && (!medicationDetails || medicationDetails.trim().length === 0)) {
        return false;
      }
    }

    return true;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl text-gray-900 mb-2">
              Health Information
            </h2>
            <p className="text-sm text-gray-600">
              A few quick health questions help us estimate your premium and determine eligibility.
            </p>
          </div>
        </div>

        {/* Gate Question */}
        <div className="mb-8">
          <label className="block text-base font-medium text-gray-900 mb-4">
            Do you have any serious medical condition?
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                onUpdate({ 
                  hasMedicalCondition: false,
                  medicalConditions: [],
                  otherCondition: '',
                  height: '',
                  weight: '',
                  smokes: undefined,
                  onMedication: undefined,
                  medicationDetails: '',
                  liveOutsideNigeria: undefined
                });
              }}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                hasMedicalCondition === false
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => onUpdate({ hasMedicalCondition: true })}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                hasMedicalCondition === true
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              Yes
            </button>
          </div>
        </div>

        {/* No Condition Message */}
        {hasMedicalCondition === false && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-green-800">
              Great. You can continue.
            </p>
          </div>
        )}

        {/* Detailed Section - Only if Yes */}
        {hasMedicalCondition === true && (
          <div className="space-y-6">
            {/* Conditions Checklist */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-3">
                Select any that apply
              </label>
              <div className="space-y-3">
                {conditions.map((condition) => (
                  <label
                    key={condition}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedConditions.includes(condition)}
                      onChange={() => toggleCondition(condition)}
                      className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-2 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">{condition}</span>
                  </label>
                ))}

                {/* Other condition with text input */}
                <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={otherCondition.trim().length > 0}
                    onChange={(e) => {
                      if (!e.target.checked) {
                        onUpdate({ otherCondition: '' });
                      }
                    }}
                    className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-2 cursor-pointer mt-0.5"
                  />
                  <div className="flex-1">
                    <span className="text-sm text-gray-700 block mb-2">Other</span>
                    {(otherCondition.length > 0 || document.activeElement?.id === 'other-condition') && (
                      <input
                        id="other-condition"
                        type="text"
                        value={otherCondition}
                        onChange={(e) => onUpdate({ otherCondition: e.target.value })}
                        placeholder="Please specify"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Height and Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => onUpdate({ height: e.target.value })}
                  placeholder="170"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => onUpdate({ weight: e.target.value })}
                  placeholder="70"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
                />
              </div>
            </div>

            {/* Smoking Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Do you smoke?
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onUpdate({ smokes: false })}
                  className={`flex-1 py-2.5 px-4 rounded-xl border-2 transition-all text-sm ${
                    smokes === false
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => onUpdate({ smokes: true })}
                  className={`flex-1 py-2.5 px-4 rounded-xl border-2 transition-all text-sm ${
                    smokes === true
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Yes
                </button>
              </div>
            </div>

            {/* Medication Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Are you currently on medication?
              </label>
              <div className="flex gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    onUpdate({ onMedication: false, medicationDetails: '' });
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-xl border-2 transition-all text-sm ${
                    onMedication === false
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => onUpdate({ onMedication: true })}
                  className={`flex-1 py-2.5 px-4 rounded-xl border-2 transition-all text-sm ${
                    onMedication === true
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Yes
                </button>
              </div>

              {/* Medication Details */}
              {onMedication === true && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medication details
                  </label>
                  <textarea
                    value={medicationDetails}
                    onChange={(e) => onUpdate({ medicationDetails: e.target.value })}
                    placeholder="Please list the medications you are currently taking"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors resize-none"
                  />
                </div>
              )}
            </div>

            {/* Live Outside Nigeria Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Do you intend to live outside Nigeria in the next 12 months?
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onUpdate({ liveOutsideNigeria: false })}
                  className={`flex-1 py-2.5 px-4 rounded-xl border-2 transition-all text-sm ${
                    liveOutsideNigeria === false
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => onUpdate({ liveOutsideNigeria: true })}
                  className={`flex-1 py-2.5 px-4 rounded-xl border-2 transition-all text-sm ${
                    liveOutsideNigeria === true
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Yes
                </button>
              </div>
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
          disabled={!isValid()}
          className={`px-8 py-3 rounded-xl transition-colors ${
            isValid()
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
