interface FinalCTAProps {
  onStartApplication?: () => void;
}

export function FinalCTA({ onStartApplication }: FinalCTAProps) {
  return (
    <section id="quote" className="py-20 sm:py-24 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white mb-8">
          Ready to get started?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onStartApplication}
            className="bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
          >
            Get a quote
          </button>
          <a
            href="#plans"
            className="bg-gray-800 text-white px-8 py-4 rounded-xl hover:bg-gray-700 transition-colors border-2 border-gray-700"
          >
            Explore plans
          </a>
        </div>
      </div>
    </section>
  );
}
