import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onStartApplication?: () => void;
}

export function Header({ onStartApplication }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="text-2xl font-semibold text-gray-900">
              insure9ja
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
              Home
            </a>
            <a href="#life-insurance" className="text-gray-700 hover:text-gray-900 transition-colors">
              Life Insurance
            </a>
            <a href="#annuity" className="text-gray-700 hover:text-gray-900 transition-colors">
              Annuity
            </a>
            <a href="#about" className="text-gray-700 hover:text-gray-900 transition-colors">
              About
            </a>
            <a href="#faqs" className="text-gray-700 hover:text-gray-900 transition-colors">
              FAQs
            </a>
            <button
              onClick={onStartApplication}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Get a quote
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                Home
              </a>
              <a href="#life-insurance" className="text-gray-700 hover:text-gray-900 transition-colors">
                Life Insurance
              </a>
              <a href="#annuity" className="text-gray-700 hover:text-gray-900 transition-colors">
                Annuity
              </a>
              <a href="#about" className="text-gray-700 hover:text-gray-900 transition-colors">
                About
              </a>
              <a href="#faqs" className="text-gray-700 hover:text-gray-900 transition-colors">
                FAQs
              </a>
              <button
                onClick={onStartApplication}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-center"
              >
                Get a quote
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
