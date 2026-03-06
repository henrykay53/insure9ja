import { HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ObjectionSection() {
  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-gray-700" />
          </div>
          <h2 className="text-3xl sm:text-4xl text-gray-900 mb-6">
            Not sure insurance is right for you?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Many people worry about cost, timing, or whether they really need it. We've answered the most common questions to help you decide with confidence.
          </p>
          <Link
            to="/faqs"
            className="inline-block bg-white text-gray-900 px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors border-2 border-gray-200"
          >
            See common questions
          </Link>
        </div>
      </div>
    </section>
  );
}
