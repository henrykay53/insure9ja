import { Edit2, Shield, TrendingUp, Calendar, User } from 'lucide-react';
import type { ApplicationData } from './ApplicationFlow';
import { QuoteCaveat } from './QuoteCaveat';
import { getAnnuityPayout, getNonRefundablePremium, getRefundablePremium } from '@/lib/quotation';

interface Step4SummaryProps {
  data: ApplicationData;
  onEdit: (step: number) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function Step4Summary({ data, onEdit, onContinue, onBack }: Step4SummaryProps) {
  const getQuote = () => {
    if (data.goal === 'non-refundable') {
      return {
        label: 'Estimated annual premium',
        amount: getNonRefundablePremium(data.coverageAmount, data.dateOfBirth),
      };
    }
    if (data.goal === 'refundable') {
      return {
        label: 'Estimated annual premium',
        amount: getRefundablePremium(data.coverageAmount, data.dateOfBirth, data.refundSchedule),
      };
    }
    if (data.goal === 'annuity') {
      const payout = getAnnuityPayout(data.coverageAmount, data.dateOfBirth, data.annuityOption);
      return {
        label: 'Estimated annual payout',
        amount: payout.annual,
      };
    }
    return {
      label: 'Estimated annual premium',
      amount: 0,
    };
  };

  // Calculate age from date of birth
  const calculateAge = () => {
    if (!data.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(data.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getPlanTypeLabel = () => {
    if (data.goal === 'non-refundable') {
      return 'Life Insurance – Non-refundable Premium';
    } else if (data.goal === 'refundable') {
      return 'Life Insurance – Refundable Premium';
    } else if (data.goal === 'annuity') {
      return 'Annuity Plan';
    }
    return '';
  };

  const getRefundStructure = () => {
    if (data.goal === 'refundable') {
      if (data.refundSchedule === '5-years') {
        return 'Refund after 5 years';
      } else if (data.refundSchedule === '3-years-9') {
        return 'Refund every 3 years for 9 years';
      }
    } else if (data.goal === 'annuity') {
      return 'Monthly payments during retirement';
    }
    return 'No refund';
  };

  const getCoverageLabel = () => {
    if (data.goal === 'annuity') {
      return 'Annual contribution';
    }
    return 'Coverage amount';
  };

  const getDuration = () => {
    if (data.goal === 'annuity') {
      return 'For life';
    }
    if (data.goal === 'refundable') {
      if (data.refundSchedule === '5-years') return '5 years';
      if (data.refundSchedule === '3-years-9') return '9 years';
    }
    return '20 years'; // Default duration
  };

  const quote = getQuote();
  const age = calculateAge();

  const summaryItems = [
    {
      label: 'Plan type',
      value: getPlanTypeLabel(),
      icon: data.goal === 'annuity' ? TrendingUp : Shield,
      editStep: 1,
    },
    {
      label: 'Refund structure',
      value: getRefundStructure(),
      icon: Calendar,
      editStep: data.goal === 'refundable' ? 2 : 1,
    },
    {
      label: getCoverageLabel(),
      value: `₦${data.coverageAmount}`,
      icon: Shield,
      editStep: data.goal === 'refundable' ? 3 : 2,
    },
    {
      label: 'Duration',
      value: getDuration(),
      icon: Calendar,
      editStep: data.goal === 'refundable' ? 3 : 2,
    },
    {
      label: 'Age',
      value: age ? `${age} years` : 'Not provided',
      icon: User,
      editStep: data.goal === 'refundable' ? 3 : 2,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Main Summary Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
        <h2 className="text-2xl sm:text-3xl text-gray-900 mb-8">
          Final Summary of Your Plan
        </h2>

        {/* Section 1: Plan Summary */}
        <div className="mb-8">
          <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-4">
            Plan Details
          </h3>
          <div className="space-y-3">
            {summaryItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{item.label}</div>
                      <div className="text-base text-gray-900">{item.value}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onEdit(item.editStep)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Premium Calculation */}
        <div className="mb-8">
          <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-4">
            Premium
          </h3>
          <div className="bg-gradient-to-br from-green-50 to-green-50/50 rounded-xl p-6 border border-green-100">
            <div className="text-sm text-gray-600 mb-2">{quote.label}</div>
            <div className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-3">
              ₦{quote.amount.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">
              This estimate is based on the information you provided.
            </p>
            <QuoteCaveat />
          </div>
        </div>

        {/* Section 3: What Happens Next */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h3 className="text-sm uppercase tracking-wide text-gray-700 mb-3">
            What happens next
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            In the next steps, we'll collect your personal details and beneficiary information to complete your application. This should only take a few minutes.
          </p>
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
          className="px-8 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors"
        >
          Continue application
        </button>
      </div>
    </div>
  );
}
