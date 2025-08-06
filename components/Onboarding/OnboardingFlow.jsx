'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const OnboardingFlow = () => {
  const { user, login } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    displayName: user?.name || user?.email?.split('@')[0] || '',
    usageType: '',
    projectName: '',
    theme: 'light'
  });
  const [loading, setLoading] = useState(false);

  const getSteps = () => {
    const baseSteps = [
      {
        id: 1,
        title: "What's your name?",
        subtitle: "Complete your profile now.",
        component: NameStep
      },
      {
        id: 2,
        title: "How do you want to use the app?",
        subtitle: "Select one to get started.",
        component: UsageStep
      }
    ];
    if (formData.usageType === 'friend') {
      baseSteps.push({
        id: 3,
        title: "Invite your friend",
        subtitle: "Request your friend by WhatsApp, Facebook, etc.",
        component: InviteFriendStep
      });
    }
    baseSteps.push({
      id: 4,
      title: "Create your first project",
      subtitle: "This will help you get started quickly.",
      component: ProjectStep
    });
    baseSteps.push({
      id: 5,
      title: "You're all set!",
      subtitle: "Welcome to your new workspace.",
      component: CompleteStep
    });
    return baseSteps;
  };

  const steps = getSteps();

  const handleNext = async () => {
    if (currentStep < steps.length) {
      if (currentStep === 1 && !formData.displayName.trim()) {
        return; // Don't proceed if name is empty
      }

      if (currentStep === steps.length - 1) {
        // Complete onboarding
        await completeOnboarding();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/save-onboarding`, {
        method: 'POST',
        credentials: 'include', // ✅ Important for sending cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: formData.displayName,
          usageType: formData.usageType,
          projectName: formData.projectName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete onboarding');
      }

      const data = await response.json();

      // ✅ Update auth context with new user data
      login(data.user);

      // ✅ Redirect to dashboard
      const userId = data.user._id || data.user.uid;
      router.push(`/dashboard/user/${userId}`);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
              {formData.displayName.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-gray-900">
              {formData.displayName || 'User'}
            </span>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">My Projects</h3>
          <div className="flex items-center space-x-2 text-blue-600">
            <span># Getting Started</span>
            <span>👋</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          {/* Progress */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-700 mb-4 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Step {currentStep} of {steps.length}</span>
            </button>
          </div>

          {/* Step Component */}
          <CurrentStepComponent
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

// ✅ Steps remain the same (NameStep, UsageStep, InviteFriendStep, ProjectStep, CompleteStep)
// Just ensure they call `onNext` and update `formData`.

export default OnboardingFlow;
