import { CheckCircle2, Car, FileText, Landmark, Shield, Info } from 'lucide-react';

const accountDetails = [
  { bank: 'GT Bank', accountNumber: '0003033066' },
  { bank: 'Zenith Bank', accountNumber: '1011564309' },
  { bank: 'First Bank', accountNumber: '2003014725' },
];

const requirements = [
  "Driver's licence",
  'Vehicle license',
  'Evidence of transfer',
  "Vehicle pictures (front, back, left, right, dashboard mileage, and driver's side VIN) for comprehensive cover",
];

export default function MotorInsurance() {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl text-gray-900 mb-3">Motor Insurance</h1>
        <p className="text-gray-600 mb-10 max-w-3xl">
          Choose your cover type, complete the required documents, and submit proof of payment.
          Custodian and Allied Insurance Limited account details are provided below.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-gray-800" />
            </div>
            <h2 className="text-xl text-gray-900 mb-2">Third-Party Cover</h2>
            <p className="text-sm text-gray-600 mb-4">Fixed premium from client requirements.</p>
            <p className="text-3xl font-semibold text-gray-900">₦15,000</p>
            <div className="mt-4 relative group">
              <button
                type="button"
                aria-label="Third-party cover explanation"
                className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Info className="w-4 h-4" />
                How this cover works
              </button>
              <div className="pointer-events-none absolute left-0 top-full mt-2 w-80 rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-600 shadow-lg opacity-0 translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0">
                If an accident happens, third-party cover pays for damage to the other vehicle and
                provides life cover for occupants of the other vehicle, up to ₦3,000,000.
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
              <Car className="w-6 h-6 text-gray-800" />
            </div>
            <h2 className="text-xl text-gray-900 mb-2">Comprehensive Cover</h2>
            <p className="text-sm text-gray-600 mb-4">Premium is based on vehicle value.</p>
            <p className="text-3xl font-semibold text-gray-900">5% of vehicle value</p>
            <div className="mt-4 relative group">
              <button
                type="button"
                aria-label="Comprehensive cover explanation"
                className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Info className="w-4 h-4" />
                How this cover works
              </button>
              <div className="pointer-events-none absolute left-0 top-full mt-2 w-80 rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-600 shadow-lg opacity-0 translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0">
                Comprehensive cover protects both your own vehicle and third-party vehicles.
                Your cover limit is based on your vehicle value.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <FileText className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl text-gray-900">Required Documents</h2>
          </div>
          <ul className="space-y-3">
            {requirements.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-gray-700 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-gray-700 rounded-xl bg-blue-50 border border-blue-200 p-4">
            Free vehicle tracker applies to cars valued at ₦4,000,000 and above.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7">
          <div className="flex items-center gap-3 mb-5">
            <Landmark className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl text-gray-900">Payment Account Details</h2>
          </div>
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">Account Name</p>
            <p className="text-base font-medium text-gray-900">Custodian and Allied Insurance Limited</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {accountDetails.map((account) => (
              <div key={account.bank} className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm text-gray-600 mb-1">{account.bank}</p>
                <p className="text-base font-semibold text-gray-900">{account.accountNumber}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Evidence of transfer is required for processing.
          </p>
        </div>
      </div>
    </section>
  );
}
