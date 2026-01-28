import { ClipboardList, FileQuestion, Calculator, Send } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    title: 'Choose a plan',
    description: 'Life insurance or retirement annuity',
  },
  {
    icon: FileQuestion,
    title: 'Answer a few questions',
    description: 'Basic information about you and your needs',
  },
  {
    icon: Calculator,
    title: 'See what your family or retirement income could be',
    description: 'Instant estimates tailored to you',
  },
  {
    icon: Send,
    title: 'Submit your application',
    description: 'Quick and secure online submission',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4">
            How it works
          </h2>
        </div>

        {/* Steps - Desktop horizontal layout */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-400 mb-2">
                    Step {index + 1}
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2 font-medium">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {step.description}
                  </p>
                </div>
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gray-200 hidden lg:block"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Steps - Mobile vertical layout */}
        <div className="md:hidden space-y-6 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-400 mb-1">
                    Step {index + 1}
                  </div>
                  <h3 className="text-lg text-gray-900 mb-1 font-medium">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-lg text-gray-600">
            Takes only a few minutes.
          </p>
        </div>
      </div>
    </section>
  );
}
