"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";

const SignUpForm = ({ setActiveTab, renderPasswordStrength }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!acceptTerms) newErrors.terms = 'You must accept the terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone: phone.trim() || undefined,
        }),
      });

      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setActiveTab('login');
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ server: error.message || 'Registration error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider) => {
    try {
      if (provider === 'google') setIsGoogleLoading(true);
      if (provider === 'facebook') setIsFacebookLoading(true);
      if (provider === 'github') setIsGithubLoading(true);

      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
      setErrors({ social: `Failed to sign in with ${provider}` });
    } finally {
      setIsGoogleLoading(false);
      setIsFacebookLoading(false);
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account 🚀</h1>
        <p className="text-gray-600">Join us today and start your journey</p>
      </div>

      {errors.server && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errors.server}
        </div>
      )}

      {errors.social && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errors.social}
        </div>
      )}

      <form onSubmit={handleSignUp} className="space-y-4">
        {/* Name */}
        <div className="relative">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg text-sm text-white ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="relative">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg text-sm text-white ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Phone (optional) */}
        <div className="relative">
          <input
            type="tel"
            placeholder="Phone Number (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg text-sm text-white ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg text-sm text-white ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {renderPasswordStrength && renderPasswordStrength(password)}

        {/* Terms */}
        <div className="flex items-start mt-4">
          <input
            id="terms"
            type="checkbox"
            checked={acceptTerms}
            onChange={() => setAcceptTerms(!acceptTerms)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
            I agree to the{" "}
            <a href="#" className="text-[#2D5339] hover:text-[#1F3C28]">
              Terms of Service
            </a>{" "}and{" "}
            <a href="#" className="text-[#2D5339] hover:text-[#1F3C28]">
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !acceptTerms}
          className="w-full bg-[#2D5339] text-white py-3 rounded-lg font-medium hover:bg-[#1F3C28] disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <i className="fas fa-spinner fa-spin mr-2"></i> Signing up...
            </div>
          ) : (
            "Sign Up"
          )}
        </button>

        {/* Social buttons */}
        <div className="relative flex items-center justify-center mt-6">
          <div className="absolute border-t border-gray-300 w-full" />
          <div className="relative bg-white px-4 text-sm text-gray-500">Or sign up with</div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleSocialSignIn('google')}
            disabled={isGoogleLoading}
            className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <i className="fas fa-spinner fa-spin text-red-500" />
            ) : (
              <i className="fab fa-google text-red-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignIn('facebook')}
            disabled={isFacebookLoading}
            className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {isFacebookLoading ? (
              <i className="fas fa-spinner fa-spin text-blue-600" />
            ) : (
              <i className="fab fa-facebook text-blue-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignIn('github')}
            disabled={isGithubLoading}
            className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {isGithubLoading ? (
              <i className="fas fa-spinner fa-spin text-gray-800" />
            ) : (
              <i className="fab fa-github text-gray-800" />
            )}
          </button>
        </div>

        {/* Switch to login */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className="text-[#2D5339] font-medium hover:text-[#1F3C28]"
          >
            Log in
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
