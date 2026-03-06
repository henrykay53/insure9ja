const pad = (value: number) => value.toString().padStart(2, '0');

const toIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
};

export const getTodayIsoDate = () => toIsoDate(new Date());

export const getProtectionMinDobIso = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 60);
  return toIsoDate(date);
};

export const isProtectionDobValid = (dob: string) => {
  if (!dob) return false;
  const minDob = getProtectionMinDobIso();
  const today = getTodayIsoDate();
  return dob >= minDob && dob <= today;
};

export const isDobOnOrBeforeToday = (dob: string) => {
  if (!dob) return false;
  return dob <= getTodayIsoDate();
};
