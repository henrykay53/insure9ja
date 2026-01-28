import { Shield } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="flex items-center justify-center mb-6">
          <Shield className="w-16 h-16" />
        </div>
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6">
            Protect What Matters Most
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Comprehensive insurance solutions tailored to your needs. Get peace of mind with coverage you can trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#quote"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Get a Free Quote
            </a>
            <a
              href="#products"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors border-2 border-white"
            >
              Explore Coverage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
