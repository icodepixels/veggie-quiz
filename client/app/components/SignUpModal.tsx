'use client';
import { useState } from 'react';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUpSuccess?: (email: string) => void;
}

interface ApiResponse {
  success: boolean;
  message: string;
  user_id?: number;
}

export default function SignUpModal({ isOpen, onClose, onSignUpSuccess }: SignUpModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notifyEmailChange = () => {
    const event = new Event('emailStatusChanged');
    window.dispatchEvent(event);
  };
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data: ApiResponse = await response.json();

      if (response.ok || response.status === 409) {
        localStorage.setItem('userEmail', email);
        if (data.user_id) {
          localStorage.setItem('userId', data.user_id.toString());
        }
        notifyEmailChange();
        onSignUpSuccess?.(email);
        setEmail(''); // Reset form
        onClose(); // Close modal
      } else {
        setError(data.message || 'Failed to sign up');
      }
    } catch (err) {
      console.error('Error submitting email:', err);
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 m-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#2d5d3c]">
              Sign Up to Save Progress
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-gray-600 mb-4">
            Enter your email to track your quiz results and progress!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#43855b] focus:border-transparent"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              )}
              <p className="mt-8 text-sm text-gray-500">
                By subscribing to Veggie Quiz you are agreeing to our{' '}
                <a href="/privacy-policy" className="text-[#43855b]" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="/terms-of-use" className="text-[#43855b]" target="_blank" rel="noopener noreferrer">
                  Terms of Use
                </a>
                .
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#43855b] text-white py-2 px-4 rounded-full transition-colors
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#2d5d3c]'}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}