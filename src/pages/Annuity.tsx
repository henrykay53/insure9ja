interface AnnuityProps {
  onStartApplication: () => void;
}

export default function Annuity({ onStartApplication }: AnnuityProps) {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl text-gray-900 mb-6">Annuity Plans</h1>
        <p className="text-lg text-gray-600 mb-8">
          Build reliable retirement income through PFA conversion, lump-sum deposit, or deferred annuity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg text-gray-900 mb-2">PFA Template</h2>
            <p className="text-sm text-gray-600">Convert your pension balance into annuity payouts.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg text-gray-900 mb-2">Lump Sum Deposit</h2>
            <p className="text-sm text-gray-600">Fund annuity directly with a one-time contribution.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg text-gray-900 mb-2">Deferred Annuity</h2>
            <p className="text-sm text-gray-600">Accumulate towards future monthly retirement income.</p>
          </div>
        </div>

        <a
          href="https://share.google/ikmu0fRRUbqlC5bA7"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900 underline mb-8"
        >
          View CPS pack (client-provided reference)
        </a>

        <div>
          <button
            onClick={onStartApplication}
            className="bg-gray-900 text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Start annuity application
          </button>
        </div>
      </div>
    </section>
  );
}
