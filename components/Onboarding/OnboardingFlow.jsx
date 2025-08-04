'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { updateToken } from '../../components/api/axiosInstance';

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
    const updatedUser = {
      ...user,
      displayName: formData.displayName,
      usageType: formData.usageType,
      hasCompletedOnboarding: true
    };
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/save-onboarding`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`, // if needed
  },
  body: JSON.stringify({
    displayName: formData.displayName,
    usageType: formData.usageType,
    projectName: formData.projectName,
    userId: user._id || user.uid,
  }),
});
    localStorage.setItem('user', JSON.stringify(updatedUser));
    login(updatedUser, localStorage.getItem('token'));
    const userId = updatedUser._id || updatedUser.uid;
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
      {/* Left Sidebar */}
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
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div className="h-2 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="h-2 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="h-2 bg-gray-200 rounded w-20"></div>
            </div>
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

          {/* Step Content */}
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

// Step 1: Name Input
const NameStep = ({ formData, setFormData, onNext, loading }) => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(formData.displayName.trim().length > 0);
  }, [formData.displayName]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          What's your name?
        </h1>
        <p className="text-gray-600 text-lg">
          Complete your profile now.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your name
          </label>
          <Input
            type="text"
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            placeholder="Enter your name"
            className="text-lg"
          />
        </div>

        {isValid && (
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {formData.displayName.charAt(0).toUpperCase()}
            </div>
            <span>Looking good!</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      <Button
        onClick={onNext}
        disabled={!isValid || loading}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-semibold rounded-lg"
      >
        {loading ? 'Processing...' : 'Continue'}
      </Button>
    </div>
  );
};

// Step 2: Usage Type Selection
const UsageStep = ({ formData, setFormData, onNext, loading }) => {
  const options = [
    {
      id: 'own',
      title: 'Own',
      description: 'I want to create and manage my own tasks.',
      icon: '🧑'
    },
    {
      id: 'friend',
      title: 'Challenges with Friend',
      description: 'I want to challenge and collaborate with a friend.',
      icon: '🤝'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          How do you want to use the app?
        </h1>
        <p className="text-gray-600 text-lg">
          Select one to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => setFormData({ ...formData, usageType: option.id })}
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
              formData.usageType === option.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-4xl mb-4">{option.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
            <p className="text-gray-600 text-sm">{option.description}</p>
          </div>
        ))}
      </div>

      <Button
        onClick={onNext}
        disabled={!formData.usageType || loading}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-semibold rounded-lg"
      >
        {loading ? 'Processing...' : 'Continue'}
      </Button>
    </div>
  );
};

// Step 3: Invite Friend (only for 'Challenges with Friend')
const InviteFriendStep = ({ formData, setFormData, onNext, loading }) => {
  const shareText = encodeURIComponent(
    `Join me in a challenge on this awesome app! Let's be productive together!`
  );
  const appUrl = encodeURIComponent(window?.location?.origin || '');
  const whatsappUrl = `https://wa.me/?text=${shareText}%20${appUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${appUrl}&quote=${shareText}`;

  return (
    <div className="space-y-6 text-center">
      <div className="text-5xl mb-4">🤝</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Invite your friend
      </h1>
      <p className="text-gray-600 text-lg mb-4">
        Request your friend by WhatsApp, Facebook, etc.
      </p>
      <div className="flex justify-center gap-4 mb-6">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Invite via WhatsApp
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Invite via Facebook
        </a>
      </div>
      <Button
        onClick={onNext}
        disabled={loading}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-semibold rounded-lg"
      >
        {loading ? 'Processing...' : 'Continue'}
      </Button>
    </div>
  );
};

// Step 3: Project Creation
const ProjectStep = ({ formData, setFormData, onNext, loading }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create your first project
        </h1>
        <p className="text-gray-600 text-lg">
          This will help you get started quickly.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project name
          </label>
          <Input
            type="text"
            value={formData.projectName}
            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            placeholder="e.g., Getting Started"
            className="text-lg"
          />
        </div>
      </div>

      <Button
        onClick={onNext}
        disabled={!formData.projectName.trim() || loading}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-semibold rounded-lg"
      >
        {loading ? 'Processing...' : 'Continue'}
      </Button>
    </div>
  );
};

// Step 4: Completion
const CompleteStep = ({ formData, onNext, loading }) => {
  return (
    <div className="space-y-6 text-center">
      <div className="text-6xl mb-4">🎉</div>
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          You're all set!
        </h1>
        <p className="text-gray-600 text-lg">
          Welcome to your new workspace, {formData.displayName}.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">What's next?</h3>
        <ul className="text-gray-600 space-y-1 text-left">
          <li>• Create your first task</li>
          <li>• Organize your projects</li>
          <li>• Invite team members (if selected team usage)</li>
        </ul>
      </div>

      <Button
        onClick={onNext}
        disabled={loading}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-semibold rounded-lg"
      >
        {loading ? 'Setting up...' : 'Get Started'}
      </Button>
    </div>
  );
};

export default OnboardingFlow; 