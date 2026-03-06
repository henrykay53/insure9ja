export default function Contact() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl text-gray-900 mb-6">Contact</h1>
        <p className="text-gray-600 mb-8">
          For product guidance or policy questions, send a message and include your phone number.
        </p>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 space-y-3">
          <p className="text-sm text-gray-700">
            Official email:{' '}
            <a className="underline" href="mailto:aedada@custodianinsurance.com">
              aedada@custodianinsurance.com
            </a>
          </p>
          <p className="text-sm text-gray-700">
            Brand: insure9ja
          </p>
        </div>
      </div>
    </section>
  );
}
