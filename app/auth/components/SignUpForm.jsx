"use client";
import React from "react";

const SignUpForm = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  acceptTerms,
  setAcceptTerms,
  errors,
  isLoading,
  isGoogleLoading,
  handleSignUp,
  handleGoogleSignIn,
  setActiveTab,
  renderPasswordStrength,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account 🚀</h1>
        <p className="text-gray-600">Join us today and start your journey</p>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            id="signup-name"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <i className="fas fa-user absolute right-3 top-3.5 text-gray-400"></i>
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        <div className="relative">
          <input
            type="email"
            id="signup-email"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <i className="fas fa-envelope absolute right-3 top-3.5 text-gray-400"></i>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div className="relative">
          <input
            type="password"
            id="signup-password"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i className="fas fa-lock absolute right-3 top-3.5 text-gray-400"></i>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>
        {renderPasswordStrength()}
        <div className="flex items-start mt-4">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="text-gray-600">
              I agree to the{" "}
              <a href="#" className="text-[#2D5339] hover:text-[#1F3C28]">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#2D5339] hover:text-[#1F3C28]">
                Privacy Policy
              </a>
            </label>
          </div>
        </div>
        <button
          onClick={handleSignUp}
          disabled={isLoading || !acceptTerms}
          className="w-full bg-[#2D5339] text-white py-3 rounded-lg font-medium hover:bg-[#1F3C28] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed !rounded-button cursor-pointer whitespace-nowrap"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Signing up...
            </div>
          ) : (
            "Sign Up"
          )}
        </button>
        <div className="relative flex items-center justify-center mt-6">
          <div className="absolute border-t border-gray-300 w-full"></div>
          <div className="relative bg-white px-4 text-sm text-gray-500">
            Or sign up with
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button
            id="google-sign-in-btn"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 !rounded-button cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <i className="fas fa-spinner fa-spin text-red-500"></i>
            ) : (
              <i className="fab fa-google text-red-500"></i>
            )}
          </button>
          <button className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 !rounded-button cursor-pointer whitespace-nowrap">
            <i className="fab fa-facebook text-blue-600"></i>
          </button>
          <button className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 !rounded-button cursor-pointer whitespace-nowrap">
            <i className="fab fa-apple text-gray-800"></i>
          </button>
        </div>
        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{" "}
          <button
            onClick={() => setActiveTab("login")}
            className="text-[#2D5339] font-medium hover:text-[#1F3C28] cursor-pointer whitespace-nowrap"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;