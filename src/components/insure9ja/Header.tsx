import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

type NavLinkItem = {
  label: string;
  to: string;
};

interface HeaderProps {
  onStartApplication?: () => void;
}

export function Header({ onStartApplication }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: NavLinkItem[] = [
    { label: "Home", to: "/" },
    { label: "Life Insurance", to: "/life-insurance" },
    { label: "Annuity", to: "/annuity" },
    { label: "About", to: "/about" },
    { label: "FAQs", to: "/faqs" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-semibold text-gray-900">
            insure9ja
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                {label}
              </Link>
            ))}

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
              onClick={() => setMobileMenuOpen((v) => !v)}
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
              {navLinks.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {label}
                </Link>
              ))}

              <button
                onClick={onStartApplication}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
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
