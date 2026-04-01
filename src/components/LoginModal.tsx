import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginModal = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits
    if (/^\d*$/.test(value) && value.length <= 10) {
      setMobileNumber(value);
      setError('');
    }
  };

  const handleLogin = async () => {
    if (mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setIsLoading(true);
    try {
      setTimeout(() => {
        login(mobileNumber);
        setIsLoading(false);
      }, 800);
      
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to login. Please try again.');
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && mobileNumber.length === 10) {
      handleLogin();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Blurred background overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Modal content */}
      <div className="bg-[#1e1e1e] rounded-lg p-8 shadow-xl w-full max-w-md z-10 relative">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login to CodeChef</h2>
        
        <div className="mb-6">
          <label htmlFor="mobileNumber" className="block text-white text-sm font-medium mb-2">
            Mobile Number
          </label>
          <input
            type="text"
            id="mobileNumber"
            value={mobileNumber}
            onChange={handleMobileNumberChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter 10-digit mobile number"
            className="w-full px-4 py-3 bg-[#2d2d2d] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        
        <button
          onClick={handleLogin}
          disabled={mobileNumber.length !== 10 || isLoading}
          className={`w-full py-3 rounded-md font-medium transition-colors duration-300 flex items-center justify-center ${
            mobileNumber.length === 10 && !isLoading
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-blue-500/50 text-white/70 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
        
        <p className="text-gray-400 text-sm mt-4 text-center">
          By logging in, you agree to our rules and regulations to participate in the contest
        </p>
      </div>
    </div>
  );
};

export default LoginModal; 