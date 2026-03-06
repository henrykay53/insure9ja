import { ArrowRight, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TrustedSection() {
  return (
    <section className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
            <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Award className="w-8 h-8 text-green-700" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl text-gray-900 mb-4">
                Trusted & regulated
              </h2>
              <p className="text-lg text-gray-600">
                insure9ja is operated by a licensed insurance professional and an authorized partner of{' '}
                <span className="font-medium text-gray-900">Custodian Life Assurance Ltd</span>, one of Nigeria's leading insurance providers.
              </p>
            </div>
          </div>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-gray-900 font-medium hover:gap-3 transition-all"
          >
            Learn more about us
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
