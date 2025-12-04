// frontend/src/components/TestAuth.js - UPDATED
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const TestAuth = () => {
  const auth = useAuth();
  
  useEffect(() => {
    console.log('🔍 Auth Context Full Diagnostics:');
    console.log('Full auth object:', auth);
    console.log('Keys:', Object.keys(auth));
    console.log('Has register?', typeof auth.register === 'function');
    console.log('Has login?', typeof auth.login === 'function');
    console.log('Has logout?', typeof auth.logout === 'function');
  }, [auth]);

  const testDirectRegistration = async () => {
    console.log('Testing direct registration...');
    
    const testData = {
      name: "Test User " + Date.now(),
      email: `test${Date.now()}@example.com`,
      password: "123456",
      phone: "0712345678",
      confirmPassword: "123456"
    };
    
    try {
      const result = await auth.register(testData);
      console.log('Direct registration result:', result);
      
      if (result.success) {
        alert('Test registration successful!');
      } else {
        alert('Test registration failed: ' + result.error);
      }
    } catch (error) {
      console.error('Registration test error:', error);
      alert('Registration test error: ' + error.message);
    }
  };

  const testBackendConnection = async () => {
    console.log('Testing backend connection...');
    
    try {
      const response = await fetch('http://localhost:5000/api/health');
      const data = await response.json();
      console.log('Backend health:', data);
      alert(`Backend is ${data.status}. Database: ${data.database}`);
    } catch (error) {
      console.error('Backend connection failed:', error);
      alert('Backend connection failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Auth Context Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Auth Context State</h2>
          
          <div className="mb-6">
            <h3 className="font-bold mb-2">Available Functions:</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded ${typeof auth.register === 'function' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="font-bold">register</div>
                <div className={typeof auth.register === 'function' ? 'text-green-600' : 'text-red-600'}>
                  {typeof auth.register === 'function' ? '✓ Available' : '✗ Missing'}
                </div>
              </div>
              <div className={`p-4 rounded ${typeof auth.login === 'function' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="font-bold">login</div>
                <div className={typeof auth.login === 'function' ? 'text-green-600' : 'text-red-600'}>
                  {typeof auth.login === 'function' ? '✓ Available' : '✗ Missing'}
                </div>
              </div>
              <div className={`p-4 rounded ${typeof auth.logout === 'function' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="font-bold">logout</div>
                <div className={typeof auth.logout === 'function' ? 'text-green-600' : 'text-red-600'}>
                  {typeof auth.logout === 'function' ? '✓ Available' : '✗ Missing'}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-2">Current State:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">User</div>
                <div className="text-lg font-bold">
                  {auth.user ? JSON.stringify(auth.user, null, 2) : 'null'}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Token</div>
                <div className="text-lg font-bold truncate">
                  {auth.token ? auth.token.substring(0, 20) + '...' : 'null'}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Loading</div>
                <div className={`text-lg font-bold ${auth.loading ? 'text-yellow-600' : 'text-green-600'}`}>
                  {auth.loading ? 'true' : 'false'}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Authenticated</div>
                <div className={`text-lg font-bold ${auth.isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                  {auth.isAuthenticated ? 'true' : 'false'}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded">
            <h3 className="font-bold mb-2">Raw Auth Data:</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(auth, null, 2)}
            </pre>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Tests</h2>
          <div className="space-y-4">
            <button
              onClick={testDirectRegistration}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={typeof auth.register !== 'function'}
            >
              Test Registration Function
            </button>
            
            <button
              onClick={testBackendConnection}
              className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Test Backend Connection
            </button>
            
            <div className="p-4 bg-yellow-50 rounded">
              <h3 className="font-bold mb-2">Check Console</h3>
              <p className="text-sm">Open Developer Tools (F12) → Console tab to see detailed logs</p>
              <p className="text-sm mt-1">Look for "Auth Context Full Diagnostics"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAuth;