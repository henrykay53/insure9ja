import { useMemo, useState } from 'react';
import { CheckCircle2, Car, FileText, Landmark, Shield, Info } from 'lucide-react';
import { submitMotorInsurance } from '@/lib/motorSubmission';

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

type CoverType = 'third-party' | 'comprehensive';
type MotorDocKey =
  | 'payment_receipt'
  | 'drivers_licence'
  | 'vehicle_license'
  | 'passport_photo'
  | 'vehicle_front'
  | 'vehicle_back'
  | 'vehicle_left'
  | 'vehicle_right'
  | 'vehicle_dashboard_mileage'
  | 'vehicle_vin';

const BASE_DOCS: Array<{ key: MotorDocKey; label: string; accept: string }> = [
  { key: 'payment_receipt', label: 'Payment receipt', accept: '.pdf,.jpg,.jpeg,.png' },
  { key: 'drivers_licence', label: "Driver's licence", accept: '.pdf,.jpg,.jpeg,.png' },
  { key: 'vehicle_license', label: 'Vehicle license', accept: '.pdf,.jpg,.jpeg,.png' },
  { key: 'passport_photo', label: 'Passport photo', accept: '.jpg,.jpeg,.png' },
];

const COMPREHENSIVE_DOCS: Array<{ key: MotorDocKey; label: string; accept: string }> = [
  { key: 'vehicle_front', label: 'Vehicle photo (front)', accept: '.jpg,.jpeg,.png' },
  { key: 'vehicle_back', label: 'Vehicle photo (back)', accept: '.jpg,.jpeg,.png' },
  { key: 'vehicle_left', label: 'Vehicle photo (left side)', accept: '.jpg,.jpeg,.png' },
  { key: 'vehicle_right', label: 'Vehicle photo (right side)', accept: '.jpg,.jpeg,.png' },
  {
    key: 'vehicle_dashboard_mileage',
    label: 'Dashboard mileage photo',
    accept: '.jpg,.jpeg,.png',
  },
  { key: 'vehicle_vin', label: "Driver's side VIN photo", accept: '.jpg,.jpeg,.png' },
];

export default function MotorInsurance() {
  const [coverType, setCoverType] = useState<CoverType>('third-party');
  const [carValue, setCarValue] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleMakeModel, setVehicleMakeModel] = useState('');
  const [vehicleRegNo, setVehicleRegNo] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
  const [docFiles, setDocFiles] = useState<Partial<Record<MotorDocKey, File>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState('');

  const requiredDocs = useMemo(
    () => (coverType === 'comprehensive' ? [...BASE_DOCS, ...COMPREHENSIVE_DOCS] : BASE_DOCS),
    [coverType],
  );

  const formatNumberInput = (value: string) => value.replace(/[^\d]/g, '');
  const formatCurrencyDisplay = (value: number) => `₦${value.toLocaleString()}`;
  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const validatePhone = (value: string) => /^\d{10,11}$/.test(value.replace(/\D/g, ''));

  const parsedCarValue = Number(carValue || '0');
  const expectedPremium =
    coverType === 'third-party' ? 15000 : Math.round((Number.isFinite(parsedCarValue) ? parsedCarValue : 0) * 0.05);
  const parsedAmountPaid = expectedPremium;
  const allDocsReady = requiredDocs.every((doc) => docFiles[doc.key]);

  const errors = {
    fullName:
      fullName.trim().length < 3 ? 'Enter your full name (at least 3 characters).' : '',
    email: validateEmail(email) ? '' : 'Enter a valid email address.',
    phone: validatePhone(phone) ? '' : 'Enter a valid phone number (10 to 11 digits).',
    vehicleMakeModel:
      vehicleMakeModel.trim().length < 2 ? 'Enter vehicle make/model.' : '',
    vehicleRegNo:
      vehicleRegNo.trim().length < 3 ? 'Enter vehicle registration number.' : '',
    paymentReference:
      paymentReference.trim().length < 3 ? 'Enter a valid payment reference.' : '',
    carValue:
      coverType === 'comprehensive' && parsedCarValue <= 0
        ? 'Enter the vehicle value to calculate premium.'
        : '',
    docs: allDocsReady ? '' : 'Upload all required documents before submitting.',
  };

  const isValid = Object.values(errors).every((error) => !error);

  const onPickFile = (key: MotorDocKey, file: File | null) => {
    setDocFiles((prev) => {
      if (!file) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: file };
    });
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || '');
        resolve(result.includes(',') ? result.split(',')[1] : result);
      };
      reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
      reader.readAsDataURL(file);
    });

  const onSubmit = async () => {
    setHasTriedSubmit(true);
    if (!isValid) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const uploadedDocuments = await Promise.all(
        requiredDocs.map(async (doc) => {
          const file = docFiles[doc.key];
          if (!file) throw new Error(`Missing ${doc.label.toLowerCase()}`);
          if (file.size > 4 * 1024 * 1024) {
            throw new Error(`${doc.label} exceeds 4MB.`);
          }
          return {
            docType: doc.key,
            filename: file.name,
            mimeType: file.type || 'application/octet-stream',
            contentBase64: await toBase64(file),
          };
        }),
      );

      const result = await submitMotorInsurance({
        coverType,
        carValue: coverType === 'comprehensive' ? parsedCarValue : null,
        expectedPremium,
        amountPaid: parsedAmountPaid,
        paymentReference: paymentReference.trim(),
        applicant: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          vehicleMakeModel: vehicleMakeModel.trim(),
          vehicleRegNo: vehicleRegNo.trim(),
        },
        uploadedDocuments,
      });

      setReferenceNumber(result.referenceNumber);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Motor insurance submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl text-gray-900 mb-3">Motor Insurance</h1>
        <p className="text-gray-600 mb-10 max-w-3xl">
          Choose your cover type, complete the required documents, and submit proof of payment.
          Custodian and Allied Insurance Limited account details are provided below.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <button
            type="button"
            onClick={() => setCoverType('third-party')}
            className={`bg-white rounded-2xl border p-6 text-left transition-colors ${
              coverType === 'third-party' ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200'
            }`}
          >
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
          </button>

          <button
            type="button"
            onClick={() => setCoverType('comprehensive')}
            className={`bg-white rounded-2xl border p-6 text-left transition-colors ${
              coverType === 'comprehensive' ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200'
            }`}
          >
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
          </button>
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

        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 mb-8">
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

        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 mb-8">
          <h2 className="text-xl text-gray-900 mb-5">Applicant and Vehicle Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none" />
              {hasTriedSubmit && errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none" />
              {hasTriedSubmit && errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div>
              <input value={phone} onChange={(e) => setPhone(formatNumberInput(e.target.value))} placeholder="Phone number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none" />
              {hasTriedSubmit && errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <input value={vehicleMakeModel} onChange={(e) => setVehicleMakeModel(e.target.value)} placeholder="Vehicle make/model" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none" />
              {hasTriedSubmit && errors.vehicleMakeModel && <p className="text-xs text-red-600 mt-1">{errors.vehicleMakeModel}</p>}
            </div>
            <div className="sm:col-span-2">
              <input value={vehicleRegNo} onChange={(e) => setVehicleRegNo(e.target.value)} placeholder="Vehicle registration number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none" />
              {hasTriedSubmit && errors.vehicleRegNo && <p className="text-xs text-red-600 mt-1">{errors.vehicleRegNo}</p>}
            </div>
            {coverType === 'comprehensive' && (
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-700 mb-2">Vehicle value (₦)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                  <input
                    value={carValue ? Number(carValue).toLocaleString() : ''}
                    onChange={(e) => setCarValue(formatNumberInput(e.target.value))}
                    placeholder="e.g. 10,000,000"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none"
                  />
                </div>
                {hasTriedSubmit && errors.carValue && <p className="text-xs text-red-600 mt-1">{errors.carValue}</p>}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 mb-8">
          <h2 className="text-xl text-gray-900 mb-5">Payment and Uploads</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs text-gray-600 mb-2">Payment reference</label>
              <input value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} placeholder="Payment reference" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none" />
              {hasTriedSubmit && errors.paymentReference && <p className="text-xs text-red-600 mt-1">{errors.paymentReference}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-2">Amount to pay</label>
              <input
                value={formatCurrencyDisplay(expectedPremium)}
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-700 focus:outline-none"
              />
            </div>
          </div>
          <div className="space-y-4">
            {requiredDocs.map((doc) => (
              <div key={doc.key} className="rounded-xl border border-gray-200 p-4">
                <label className="block text-sm font-medium text-gray-800 mb-2">{doc.label}</label>
                <input
                  type="file"
                  accept={doc.accept}
                  onChange={(e) => onPickFile(doc.key, e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-gray-800"
                />
                {docFiles[doc.key] && <p className="text-xs text-gray-600 mt-2">Selected: {docFiles[doc.key]?.name}</p>}
              </div>
            ))}
          </div>
          {hasTriedSubmit && errors.docs && (
            <p className="text-xs text-red-600 mt-3">{errors.docs}</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7">
          <h2 className="text-xl text-gray-900 mb-4">Summary</h2>
          <div className="space-y-2 text-sm text-gray-700 mb-5">
            <p><span className="text-gray-500">Cover type:</span> {coverType === 'third-party' ? 'Third-party' : 'Comprehensive'}</p>
            <p><span className="text-gray-500">Expected premium:</span> {formatCurrencyDisplay(expectedPremium)}</p>
            <p><span className="text-gray-500">Amount paid:</span> {formatCurrencyDisplay(parsedAmountPaid || 0)}</p>
          </div>

          {submitError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          {referenceNumber && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              Submission complete. Reference: <span className="font-semibold">{referenceNumber}</span>
            </div>
          )}

          <button
            type="button"
            onClick={onSubmit}
            disabled={!isValid || isSubmitting}
            className={`px-8 py-3 rounded-xl transition-colors ${
              !isValid || isSubmitting
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Motor Insurance'}
          </button>
        </div>
      </div>
    </section>
  );
}
