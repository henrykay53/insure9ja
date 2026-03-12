import { Link } from 'react-router-dom';
import { Shield, TrendingUp, Car, ArrowRight } from 'lucide-react';

interface OurPlansProps {
  onStartApplication?: () => void;
}

export function OurPlans({ onStartApplication }: OurPlansProps) {
  void onStartApplication;
  return (
    <section id="plans" className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4">
            Our plans
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Life Insurance Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-gray-900" />
            </div>
            <h3 className="text-2xl text-gray-900 mb-4">
              Life Insurance
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Financial protection for your family if anything happens to you.
            </p>
            <Link
              to="/life-insurance"
              className="inline-flex items-center gap-2 text-gray-900 font-medium hover:gap-3 transition-all"
            >
              Learn more
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Annuity Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-7 h-7 text-gray-900" />
            </div>
            <h3 className="text-2xl text-gray-900 mb-4">
              Annuity
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Guaranteed monthly income to support you during retirement.
            </p>
            <Link
              to="/annuity"
              className="inline-flex items-center gap-2 text-gray-900 font-medium hover:gap-3 transition-all"
            >
              Learn more
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Motor Insurance Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
              <Car className="w-7 h-7 text-gray-900" />
            </div>
            <h3 className="text-2xl text-gray-900 mb-4">
              Motor Insurance
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Third-party and comprehensive cover options with clear document requirements.
            </p>
            <Link
              to="/motor-insurance"
              className="inline-flex items-center gap-2 text-gray-900 font-medium hover:gap-3 transition-all"
            >
              Learn more
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
