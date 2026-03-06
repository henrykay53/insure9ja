import { useState } from 'react';
import type { ApplicationData } from './ApplicationFlow';
import { DateDropdownInput } from './DateDropdownInput';
import { getTodayIsoDate } from './dateRules';

interface Step5PersonalDetailsProps {
  data: ApplicationData;
  onUpdate: (updates: Partial<ApplicationData>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function Step5PersonalDetails({ data, onUpdate, onContinue, onBack }: Step5PersonalDetailsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const today = getTodayIsoDate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    // Remove spaces and check if it's 10-11 digits after country code
    const cleanPhone = phone.replace(/\s/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11 && /^\d+$/.test(cleanPhone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and spaces
    const cleaned = value.replace(/[^\d\s]/g, '');
    onUpdate({ phoneNumber: cleaned });
    
    if (cleaned && !validatePhone(cleaned)) {
      setErrors({ ...errors, phone: 'Please enter a valid Nigerian phone number' });
    } else {
      const newErrors = { ...errors };
      delete newErrors.phone;
      setErrors(newErrors);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onUpdate({ email: value });
    
    if (value && !validateEmail(value)) {
      setErrors({ ...errors, email: 'Please enter a valid email address' });
    } else {
      const newErrors = { ...errors };
      delete newErrors.email;
      setErrors(newErrors);
    }
  };

  // const formatDOBDisplay = (date: string) => {
  //   if (!date) return '';
  //   const [year, month, day] = date.split('-');
  //   return `${day} / ${month} / ${year}`;
  // };

  const isValid = 
    data.firstName &&
    data.lastName &&
    data.phoneNumber &&
    validatePhone(data.phoneNumber) &&
    data.email &&
    validateEmail(data.email) &&
    data.personalDOB &&
    Object.keys(errors).length === 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
        <h2 className="text-2xl sm:text-3xl text-gray-900 mb-2">
          Personal Details
        </h2>
        <p className="text-gray-600 mb-8">
          Please provide your personal information to continue your application.
        </p>

        <div className="space-y-5">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First name
            </label>
            <input
              type="text"
              id="firstName"
              value={data.firstName || ''}
              onChange={(e) => onUpdate({ firstName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
              placeholder="Enter your first name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              value={data.lastName || ''}
              onChange={(e) => onUpdate({ lastName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
              placeholder="Enter your last name"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone number
            </label>
            <div className="flex gap-2">
              <div className="flex items-center px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 flex-shrink-0">
                +234
              </div>
              <div className="flex-1">
                <input
                  type="tel"
                  id="phone"
                  value={data.phoneNumber || ''}
                  onChange={handlePhoneChange}
                  className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                    errors.phone
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900'
                  } focus:outline-none focus:ring-1`}
                  placeholder="8012345678"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={data.email || ''}
              onChange={handleEmailChange}
              className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                errors.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900'
              } focus:outline-none focus:ring-1`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="personalDOB" className="block text-sm font-medium text-gray-700 mb-2">
              Date of birth
            </label>
            <DateDropdownInput
              idPrefix="personalDOB"
              value={data.personalDOB || ''}
              onChange={(value) => onUpdate({ personalDOB: value })}
              min="1920-01-01"
              max={today}
            />
            <p className="text-sm text-gray-500 mt-2">
              Used to calculate your premium accurately.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={!isValid}
          className={`px-8 py-3 rounded-xl transition-colors ${
            isValid
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
