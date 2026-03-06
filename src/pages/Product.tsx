interface ProductProps {
  onStartApplication: () => void;
}

const Product = ({ onStartApplication }: ProductProps) => {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl text-gray-900 mb-6">Life Insurance</h1>
        <p className="text-lg text-gray-600 mb-8">
          Choose a protection option that matches your budget and family goals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl text-gray-900 mb-2">Refundable Premium</h2>
            <p className="text-sm text-gray-600">
              Protect your family and receive structured refunds based on selected schedule.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl text-gray-900 mb-2">Non-Refundable Premium</h2>
            <p className="text-sm text-gray-600">
              Lower-cost protection focused on payout security for beneficiaries.
            </p>
          </div>
        </div>

        <button
          onClick={onStartApplication}
          className="bg-gray-900 text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors"
        >
          Start application
        </button>
      </div>
    </section>
  );
};

export default Product;
