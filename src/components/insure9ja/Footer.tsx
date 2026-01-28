import { Link } from "react-router-dom";

type FooterLink = {
  label: string;
  to: string;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

export function Footer() {
  const footerSections: FooterSection[] = [
    {
      title: "Products",
      links: [
        { label: "Life Insurance", to: "/life-insurance" },
        { label: "Annuity Plans", to: "/annuity" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", to: "/about" },
        { label: "FAQs", to: "/faqs" },
        { label: "Contact", to: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", to: "/privacy" },
        { label: "Terms of Service", to: "/terms" },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-xl font-semibold text-gray-900 mb-4">
              insure9ja
            </div>
            <p className="text-sm text-gray-600">
              Simple insurance and retirement plans from a licensed Custodian Life Assurance partner.
            </p>
          </div>

          {/* Mapped sections */}
          {footerSections.map(({ title, links }) => (
            <div key={title}>
              <h3 className="font-medium text-gray-900 mb-4">{title}</h3>
              <ul className="space-y-2 text-sm">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
