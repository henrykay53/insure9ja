import { useState } from 'react';
import { X } from 'lucide-react';
import { ProgressIndicator } from './ProgressIndicator';
import { Step1GoalSelection } from './Step1GoalSelection';
import { Step2ARefundSchedule } from './Step2ARefundSchedule';
import { Step3ARefund5Years } from './Step3ARefund5Years';
import { Step3BRefund3Years } from './Step3BRefund3Years';
import { Step2BNonRefundable } from './Step2BNonRefundable';
import { Step2CAnnuity } from './Step2CAnnuity';
import { Step4Summary } from './Step4Summary';
import { Step5PersonalDetails } from './Step5PersonalDetails';
import { Step6IdentityVerification } from './Step6IdentityVerification';
import { Step7Beneficiaries } from './Step7Beneficiaries';

interface ApplicationFlowProps {
  onClose: () => void;
}

export type GoalType = 'non-refundable' | 'refundable' | 'annuity' | null;
export type RefundSchedule = '5-years' | '3-years-9' | null;

export interface Beneficiary {
  id: string;
  fullName: string;
  relationship: string;
  dateOfBirth: string;
  phoneNumber: string;
  percentage: number;
}

export interface ApplicationData {
  goal: GoalType;
  refundSchedule: RefundSchedule;
  coverageAmount: string;
  dateOfBirth: string;
  payMonthlyForLife: boolean;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  personalDOB: string;
  bvn: string;
  nin: string;
  idType: string;
  idNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  beneficiaries: Beneficiary[];
}

export function ApplicationFlow({ onClose }: ApplicationFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [data, setData] = useState<ApplicationData>({
    goal: null,
    refundSchedule: null,
    coverageAmount: '',
    dateOfBirth: '',
    payMonthlyForLife: false,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    personalDOB: '',
    bvn: '',
    nin: '',
    idType: '',
    idNumber: '',
    issuingAuthority: '',
    issueDate: '',
    expiryDate: '',
    beneficiaries: [],
  });

  const getTotalSteps = () => {
    if (data.goal === 'refundable') return 7;
    if (data.goal === 'non-refundable') return 6;
    if (data.goal === 'annuity') return 6;
    return 6;
  };

  const goToNextStep = () => {
    setDirection('forward');
    setCurrentStep((prev) => prev + 1);
  };

  const goToPreviousStep = () => {
    setDirection('backward');
    setCurrentStep((prev) => prev - 1);
  };

  const goToStep = (step: number) => {
    setDirection(step > currentStep ? 'forward' : 'backward');
    setCurrentStep(step);
  };

  const updateData = (updates: Partial<ApplicationData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <Step1GoalSelection
          selectedGoal={data.goal}
          onSelectGoal={(goal) => updateData({ goal })}
          onContinue={goToNextStep}
          onBack={goToPreviousStep}
        />
      );
    }

    // Refundable premium flow
    if (data.goal === 'refundable') {
      if (currentStep === 2) {
        return (
          <Step2ARefundSchedule
            selectedSchedule={data.refundSchedule}
            onSelectSchedule={(schedule) => updateData({ refundSchedule: schedule })}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      }
      if (currentStep === 3 && data.refundSchedule === '5-years') {
        return (
          <Step3ARefund5Years
            data={data}
            onUpdate={updateData}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      }
      if (currentStep === 3 && data.refundSchedule === '3-years-9') {
        return (
          <Step3BRefund3Years
            data={data}
            onUpdate={updateData}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      }
      if (currentStep === 4) {
        return (
          <Step4Summary
            data={data}
            onEdit={goToStep}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      }
      if (currentStep === 5) {
        return (
          <Step5PersonalDetails
            data={data}
            onUpdate={updateData}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      }
      if (currentStep === 6) {
        return (
          <Step6IdentityVerification
            data={data}
            onUpdate={updateData}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      }
      if (currentStep === 7) {
        return (
          <Step7Beneficiaries
            data={data}
            onUpdate={updateData}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      }
    }

    // Non-refundable premium flow
    if (data.goal === 'non-refundable') {
      if (currentStep === 2) {
        return (
          <Step2BNonRefundable
            data={data}
            onUpdate={updateData}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      }
      if (currentStep === 3) {
        return (
          <Step4Summary
            data={data}
            onEdit={goToStep}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      }
      if (currentStep === 4) {
        return (
          <Step5PersonalDetails
            data={data}
            onUpdate={updateData}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      }
      if (currentStep === 5) {
        return (
          <Step6IdentityVerification
            data={data}
            onUpdate={updateData}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      }
      if (currentStep === 6) {
        return (
          <Step7Beneficiaries
            data={data}
            onUpdate={updateData}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      }
    }

    // Annuity flow
    if (data.goal === 'annuity') {
      if (currentStep === 2) {
        return (
          <Step2CAnnuity
            data={data}
            onUpdate={updateData}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      }
      if (currentStep === 3) {
        return (
          <Step4Summary
            data={data}
            onEdit={goToStep}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      }
      if (currentStep === 4) {
        return (
          <Step5PersonalDetails
            data={data}
            onUpdate={updateData}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      }
      if (currentStep === 5) {
        return (
          <Step6IdentityVerification
            data={data}
            onUpdate={updateData}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      }
      if (currentStep === 6) {
        return (
          <Step7Beneficiaries
            data={data}
            onUpdate={updateData}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      }
    }

    return <div>Step not found</div>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-semibold text-gray-900">insure9ja</div>
              <div className="text-sm text-gray-600">Life Insurance Application</div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <ProgressIndicator currentStep={currentStep} totalSteps={getTotalSteps()} />
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="relative overflow-hidden">
          <div
            className={`transition-all duration-300 ease-in-out ${
              direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'
            }`}
          >
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}