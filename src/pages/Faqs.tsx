import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  objectionCategoryLabels,
  objections,
  type ObjectionCategoryId,
} from '@/data/objections';

const quickFaqs = [
  {
    q: 'How long does application take?',
    a: 'Most applicants complete the guided flow in a few minutes.',
  },
  {
    q: 'How is premium estimated?',
    a: 'Premium appears after key details are entered. Final underwriting review still applies.',
  },
  {
    q: 'Can I choose refundable or non-refundable plans?',
    a: 'Yes. You can choose either based on your goals and cost preference.',
  },
];

const categories = Object.keys(objectionCategoryLabels) as ObjectionCategoryId[];

export default function Faqs() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ObjectionCategoryId | 'all'>('all');
  const [showAll, setShowAll] = useState(false);

  const filteredObjections = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return objections.filter((item) => {
      const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
      if (!normalized) return categoryMatch;

      const content = `${item.objection} ${item.response}`.toLowerCase();
      return categoryMatch && content.includes(normalized);
    });
  }, [activeCategory, query]);

  const visibleObjections = showAll ? filteredObjections : filteredObjections.slice(0, 8);

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl text-gray-900 mb-3">FAQs & Common Concerns</h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Find quick answers and objection responses without going through a long script.
          Start with your concern category, then open only what matters to you.
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search concerns (e.g. afford, wife, religion, later)"
              className="w-full lg:max-w-xl px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
            />

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === category
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {objectionCategoryLabels[category]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {visibleObjections.length === 0 && (
            <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
              No matching concern found. Try another keyword or clear filters.
            </div>
          )}

          {visibleObjections.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-xs text-gray-500 mb-2">{objectionCategoryLabels[item.category]}</p>
              <h2 className="text-lg text-gray-900 mb-2">{item.objection}</h2>
              <p className="text-sm text-gray-600 mb-4">{item.response}</p>
              <Link
                to={item.ctaTo}
                className="inline-flex items-center text-sm text-gray-900 font-medium hover:underline"
              >
                {item.ctaLabel}
              </Link>
            </div>
          ))}
        </div>

        {filteredObjections.length > 8 && (
          <div className="mb-12">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="text-sm text-gray-700 hover:text-gray-900 underline"
            >
              {showAll ? 'Show fewer responses' : `Show all ${filteredObjections.length} responses`}
            </button>
          </div>
        )}

        <h2 className="text-2xl text-gray-900 mb-4">Quick FAQs</h2>
        <div className="space-y-4 mb-10">
          {quickFaqs.map((item) => (
            <div key={item.q} className="rounded-xl border border-gray-200 p-5 bg-white">
              <h3 className="text-lg text-gray-900 mb-2">{item.q}</h3>
              <p className="text-sm text-gray-600">{item.a}</p>
            </div>
          ))}
        </div>

        <a
          href="https://custodianlifeassurance.com/faqs-frequently-asked-questions/"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-gray-700 hover:text-gray-900 underline"
        >
          See Custodian Life Assurance FAQ reference
        </a>
      </div>
    </section>
  );
}
