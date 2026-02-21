import { CheckCircle2, ArrowLeft, Mail } from 'lucide-react';

interface ApplicationReceivedProps {
  referenceNumber: string;
  email: string;
  onReturnHome: () => void;
}

export function ApplicationReceived({ referenceNumber, email, onReturnHome }: ApplicationReceivedProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl text-gray-900 mb-3">
            Your application has been received
          </h1>

          {/* Subtext */}
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Thank you for submitting your life insurance application. We will review your details and contact you shortly.
          </p>

          {/* Reference Number */}
          <div className="bg-gray-50 rounded-xl p-5 mb-8 max-w-md mx-auto">
            <p className="text-sm text-gray-600 mb-1">Application Reference Number</p>
            <p className="text-xl font-semibold text-gray-900 font-mono">{referenceNumber}</p>
          </div>

          {/* What Happens Next Section */}
          <div className="border-t border-gray-200 pt-8 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-left">
              What happens next?
            </h2>
            <div className="space-y-4 text-left">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-gray-600">1</span>
                </div>
                <p className="text-sm text-gray-700">
                  Your application has been forwarded for processing.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-gray-600">2</span>
                </div>
                <p className="text-sm text-gray-700">
                  A licensed advisor may contact you if additional information is required.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-gray-600">3</span>
                </div>
                <p className="text-sm text-gray-700">
                  You will receive further communication regarding approval and payment instructions.
                </p>
              </div>
            </div>
          </div>

          {/* Email Confirmation */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm text-gray-700">
                A confirmation email has been sent to{' '}
                <span className="font-medium text-gray-900">{email}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onReturnHome}
              className="w-full px-8 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Return to Home
            </button>
            
            <a
              href="mailto:support@insure9ja.com"
              className="block w-full px-8 py-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Contact support
            </a>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <a href="mailto:support@insure9ja.com" className="text-gray-700 hover:text-gray-900 underline">
              Get in touch with our team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
