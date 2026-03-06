import { useMemo, useState } from 'react';

interface DateDropdownInputProps {
  idPrefix: string;
  value: string;
  onChange: (value: string) => void;
  min: string;
  max: string;
}

const MONTH_OPTIONS = [
  { value: '01', label: 'Jan' },
  { value: '02', label: 'Feb' },
  { value: '03', label: 'Mar' },
  { value: '04', label: 'Apr' },
  { value: '05', label: 'May' },
  { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' },
  { value: '08', label: 'Aug' },
  { value: '09', label: 'Sep' },
  { value: '10', label: 'Oct' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Dec' },
];

const pad = (num: number) => num.toString().padStart(2, '0');

const parseIsoDate = (iso: string) => {
  const parts = iso.split('-');
  if (parts.length !== 3) return null;
  const [year, month, day] = parts;
  if (!year || !month || !day) return null;
  return { year, month, day };
};

export function DateDropdownInput({ idPrefix, value, onChange, min, max }: DateDropdownInputProps) {
  const initial = parseIsoDate(value);
  const [selectedYear, setSelectedYear] = useState(initial?.year ?? '');
  const [selectedMonth, setSelectedMonth] = useState(initial?.month ?? '');
  const [selectedDay, setSelectedDay] = useState(initial?.day ?? '');

  const minYear = Number(min.split('-')[0]) || 1900;
  const maxYear = Number(max.split('-')[0]) || new Date().getFullYear();

  const yearOptions = useMemo(() => {
    const years: string[] = [];
    for (let year = maxYear; year >= minYear; year -= 1) {
      years.push(year.toString());
    }
    return years;
  }, [minYear, maxYear]);

  const daysInMonth = selectedYear && selectedMonth
    ? new Date(Number(selectedYear), Number(selectedMonth), 0).getDate()
    : 31;

  const dayOptions = useMemo(
    () => Array.from({ length: daysInMonth }, (_, index) => pad(index + 1)),
    [daysInMonth],
  );

  const commit = (year: string, month: string, day: string) => {
    if (!year || !month || !day) {
      onChange('');
      return;
    }

    const iso = `${year}-${month}-${day}`;
    if (iso < min || iso > max) {
      onChange('');
      return;
    }

    onChange(iso);
  };

  const baseSelectClass =
    'w-full px-3 py-3 rounded-xl border border-gray-200 bg-white focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors';

  return (
    <div className="grid grid-cols-3 gap-3">
      <select
        id={`${idPrefix}-day`}
        value={selectedDay}
        onChange={(e) => {
          const nextDay = e.target.value;
          setSelectedDay(nextDay);
          commit(selectedYear, selectedMonth, nextDay);
        }}
        className={baseSelectClass}
      >
        <option value="">Day</option>
        {dayOptions.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>

      <select
        id={`${idPrefix}-month`}
        value={selectedMonth}
        onChange={(e) => {
          const nextMonth = e.target.value;
          setSelectedMonth(nextMonth);

          const maxDaysInNextMonth = selectedYear
            ? new Date(Number(selectedYear), Number(nextMonth || '1'), 0).getDate()
            : 31;

          const safeDay =
            selectedDay && Number(selectedDay) <= maxDaysInNextMonth ? selectedDay : '';
          setSelectedDay(safeDay);
          commit(selectedYear, nextMonth, safeDay);
        }}
        className={baseSelectClass}
      >
        <option value="">Month</option>
        {MONTH_OPTIONS.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>

      <select
        id={`${idPrefix}-year`}
        value={selectedYear}
        onChange={(e) => {
          const nextYear = e.target.value;
          setSelectedYear(nextYear);

          const maxDaysInNextMonth = selectedMonth
            ? new Date(Number(nextYear || maxYear), Number(selectedMonth), 0).getDate()
            : 31;

          const safeDay =
            selectedDay && Number(selectedDay) <= maxDaysInNextMonth ? selectedDay : '';
          setSelectedDay(safeDay);
          commit(nextYear, selectedMonth, safeDay);
        }}
        className={baseSelectClass}
      >
        <option value="">Year</option>
        {yearOptions.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
