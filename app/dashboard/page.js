"use client";
import ProtectedRoute from "../../components/ProtectedRoute";
import SessionStatus from "../../components/SessionStatus";
import OnboardingFlow from "../../components/Onboarding/OnboardingFlow";
import { useAuth } from "../../contexts/AuthContext";

export default function Dashboard() {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show onboarding for first-time users
  if (user && !user.hasCompletedOnboarding) {
    return <OnboardingFlow />;
  }

  // Show regular dashboard for returning users
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Welcome back, {user?.displayName || user?.name || 'User'}!
          </h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Welcome to your dashboard! This page is protected and only accessible to authenticated users.</p>
            <p className="text-gray-600 mt-4">Your session is automatically managed. The token is stored in both localStorage and cookies for persistence.</p>
          </div>
        </div>
        <SessionStatus />
      </div>
    </ProtectedRoute>
  );
}
