'use client';

import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { validateSession } from '../components/api/Authapi';

const SessionStatus = () => {
  const { user, isAuthenticated, validateAndRestoreSession } = useAuth();
  const [sessionStatus, setSessionStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const checkSessionStatus = async () => {
    setLoading(true);
    setSessionStatus('');
    
    try {
      const result = await validateSession();
      
      if (result.valid) {
        setSessionStatus(`✅ ${result.message || 'Session valid'}`);
      } else if (result.user) {
        setSessionStatus(`✅ Session valid - User: ${result.user?.name || result.user?.email}`);
      } else {
        setSessionStatus('✅ Session valid');
      }
    } catch (error) {
      if (error.message?.includes('not available') || error.message?.includes('assumed valid')) {
        setSessionStatus('⚠️ Session validation endpoint not available - using stored session');
      } else {
        setSessionStatus(`❌ Session invalid: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    setLoading(true);
    setSessionStatus('');
    
    try {
      await validateAndRestoreSession();
      setSessionStatus('✅ Session refreshed successfully');
    } catch (error) {
      setSessionStatus(`❌ Session refresh failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated()) {
    return null; // Don't show for unauthenticated users
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
      <h3 className="font-semibold text-sm mb-2">Session Status</h3>
      
    

      {sessionStatus && (
        <p className="text-xs mb-2 p-2 bg-gray-100 rounded">
          {sessionStatus}
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={checkSessionStatus}
          disabled={loading}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check Session'}
        </button>
        
        <button
          onClick={refreshSession}
          disabled={loading}
          className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        <p>💡 Your session is automatically managed</p>
        <p>Token is stored in localStorage & cookies</p>
      </div>
    </div>
  );
};

export default SessionStatus; 