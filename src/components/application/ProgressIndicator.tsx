interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600">
        Step {currentStep} of {totalSteps}
      </div>
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index < currentStep
                ? 'w-8 bg-gray-900'
                : index === currentStep - 1
                ? 'w-12 bg-gray-900'
                : 'w-8 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
