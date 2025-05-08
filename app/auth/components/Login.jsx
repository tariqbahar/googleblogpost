'use client';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

const LoginForm = ({ setActiveTab }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrors({});

    if (!email || !password) {
      setErrors({ loginError: 'Please enter both email and password' });
      setIsLoading(false);
      return;
    }

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      console.error('❌ Login error:', result.error);
      setErrors({ loginError: result.error });
    } else {
      window.location.href = '/dashboard'; // or your post-login route
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back 👋</h1>
        <p className="text-gray-600">Sign in to continue to your account</p>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <div className="relative">
          <input
            type="email"
            id="login-email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <i className="fas fa-envelope absolute right-3 top-3.5 text-gray-400"></i>
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type="password"
            id="login-password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i className="fas fa-lock absolute right-3 top-3.5 text-gray-400"></i>
        </div>

        {/* Remember Me & Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm text-gray-700">
            <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            <span className="ml-2">Remember me</span>
          </label>
          <button
            onClick={() => setActiveTab?.('forgot')}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-[#2D5339] text-white py-3 rounded-lg font-medium hover:bg-[#1F3C28] transition disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex justify-center items-center">
              <i className="fas fa-spinner fa-spin mr-2" />
              Logging in...
            </div>
          ) : (
            'Login'
          )}
        </button>

        {errors.loginError && (
          <p className="text-red-500 text-sm text-center mt-2">{errors.loginError}</p>
        )}

        {/* Divider */}
        <div className="relative flex items-center justify-center mt-6">
          <div className="absolute border-t border-gray-300 w-full" />
          <div className="relative bg-white px-4 text-sm text-gray-500">Or continue with</div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => {
              setIsGoogleLoading(true);
              signIn('google', { callbackUrl: '/dashboard' });
            }}
            disabled={isGoogleLoading}
            className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <i className="fas fa-spinner fa-spin text-red-500"></i>
            ) : (
              <i className="fab fa-google text-red-500"></i>
            )}
          </button>

          <button
            onClick={() => signIn('facebook', { callbackUrl: '/dashboard' })}
            className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <i className="fab fa-facebook text-blue-600"></i>
          </button>

          <button
            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
            className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <i className="fab fa-github text-gray-800"></i>
          </button>
        </div>

        {/* Sign up switch */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Don’t have an account?{' '}
          <button
            onClick={() => setActiveTab?.('signup')}
            className="text-[#2D5339] font-medium hover:text-[#1F3C28]"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
