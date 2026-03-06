export function QuoteCaveat() {
  return (
    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <p className="text-xs font-medium text-amber-900 mb-2">
        Important caveat
      </p>
      <ul className="text-xs text-amber-900 space-y-1 list-disc list-inside">
        <li>Terms and conditions apply.</li>
        <li>Final approved values may be slightly different from this estimate.</li>
      </ul>
    </div>
  );
}
