import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Homeowner',
    content: 'The claims process was incredibly smooth. They handled everything professionally and my claim was processed within 2 days.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Business Owner',
    content: 'Excellent business insurance coverage at competitive rates. Their team took the time to understand my needs.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Family Plan Holder',
    content: 'We have our auto, home, and life insurance with them. Great service and peace of mind for our family.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600">
            Join thousands of satisfied customers who trust us with their coverage
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
              <div>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
