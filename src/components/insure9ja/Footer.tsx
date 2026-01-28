export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-xl font-semibold text-gray-900 mb-4">
              insure9ja
            </div>
            <p className="text-sm text-gray-600">
              Simple insurance and retirement plans from a licensed Custodian Life Assurance partner.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#life-insurance" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Life Insurance
                </a>
              </li>
              <li>
                <a href="#annuity" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Annuity Plans
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#faqs" className="text-gray-600 hover:text-gray-900 transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 text-center">
            © 2026 insure9ja. Licensed partner of Custodian Life Assurance Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
