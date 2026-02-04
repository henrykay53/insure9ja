import { Shield, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface HeroProps {
  onStartApplication?: () => void;
}

export function Hero({ onStartApplication }: HeroProps) {
  return (
    <section className="relative bg-linear-to-b from-gray-50 to-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 opacity-5">
          <Shield size={300} className="text-gray-900" />
        </div>
        <div className="absolute bottom-20 left-10 opacity-5">
          <TrendingUp size={250} className="text-gray-900" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-6">
              Protect your family. Plan your future.
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Simple life insurance and retirement plans from a licensed Custodian Life Assurance partner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onStartApplication}
                className="bg-gray-900 text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
              >
                Get a quote
              </button>
              <a
                href="#how-it-works"
                className="bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors border-2 border-gray-200"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Right column - Visual */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80"
                alt="Family protection"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating accent card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100 hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Trusted by</div>
                  <div className="font-semibold text-gray-900">10,000+ Nigerians</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
