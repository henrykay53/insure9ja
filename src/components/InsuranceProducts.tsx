import { Car, Home, Heart, Briefcase, Users, Plane } from 'lucide-react';

const products = [
  {
    icon: Car,
    title: 'Auto Insurance',
    description: 'Comprehensive coverage for your vehicle with competitive rates and 24/7 roadside assistance.',
  },
  {
    icon: Home,
    title: 'Home Insurance',
    description: 'Protect your home and belongings from unexpected events with customizable coverage options.',
  },
  {
    icon: Heart,
    title: 'Life Insurance',
    description: 'Secure your family\'s financial future with flexible life insurance plans.',
  },
  {
    icon: Briefcase,
    title: 'Business Insurance',
    description: 'Comprehensive protection for your business, from liability to property coverage.',
  },
  {
    icon: Users,
    title: 'Health Insurance',
    description: 'Access quality healthcare with plans designed for individuals and families.',
  },
  {
    icon: Plane,
    title: 'Travel Insurance',
    description: 'Travel with confidence knowing you\'re covered for trip cancellations and emergencies.',
  },
];

export function InsuranceProducts() {
  return (
    <div id="products" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl mb-4">Our Insurance Products</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive coverage options designed to protect you and your loved ones
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <div
                key={product.title}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl mb-3">{product.title}</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
