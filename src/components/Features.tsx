import { Clock, DollarSign, Shield, HeadphonesIcon } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: 'Fast Claims Processing',
    description: '24/7 claims support with average processing time of 48 hours',
  },
  {
    icon: DollarSign,
    title: 'Competitive Rates',
    description: 'Best value coverage with flexible payment options',
  },
  {
    icon: Shield,
    title: 'Trusted Protection',
    description: 'Over 30 years of experience serving millions of customers',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Expert agents available anytime to assist with your needs',
  },
];

export function Features() {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl mb-4">Why Choose Us</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're committed to providing exceptional service and reliable coverage
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center">
                <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
