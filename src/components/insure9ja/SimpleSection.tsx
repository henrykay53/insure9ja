import { CheckCircle2 } from 'lucide-react';
// import { ImageWithFallback } from '../figma/ImageWithFallback';

export function SimpleSection() {
  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Text */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-6">
              Insurance made simple
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              insure9ja helps you understand your options, estimate what your family would receive, and apply for the right plan in minutes.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              No confusion. No pressure. Just clear guidance, step by step.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">Easy-to-understand plan comparisons</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">Instant benefit estimates</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">Quick online application process</p>
              </div>
            </div>
          </div>

          {/* Right column - Dashboard visual */}
          <div className="relative">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-lg">
              <div className="space-y-4">
                {/* Mock dashboard elements */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Monthly Premium</div>
                    <div className="text-2xl font-semibold text-gray-900">₦15,000</div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-green-600 rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="text-sm text-gray-500 mb-2">Family Coverage</div>
                  <div className="text-3xl font-semibold text-gray-900 mb-1">₦5,000,000</div>
                  <div className="text-sm text-green-600">Guaranteed payout</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">Coverage Period</div>
                    <div className="text-lg font-semibold text-gray-900">20 years</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">Application Time</div>
                    <div className="text-lg font-semibold text-gray-900">5 minutes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
