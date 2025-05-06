"use client";
import React from "react";

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  errors,
  isLoading,
  isGoogleLoading,
  handleLogin,
  handleGoogleSignIn,
  setActiveTab,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back 👋</h1>
        <p className="text-gray-600">Sign in to continue to your account</p>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <input
            type="email"
            id="login-email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <i className="fas fa-envelope absolute right-3 top-3.5 text-gray-400"></i>
        </div>
        <div className="relative">
          <input
            type="password"
            id="login-password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i className="fas fa-lock absolute right-3 top-3.5 text-gray-400"></i>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember-me"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <button
            onClick={() => setActiveTab("forgot")}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer whitespace-nowrap"
          >
            Forgot Password?
          </button>
        </div>
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-[#2D5339] text-white py-3 rounded-lg font-medium hover:bg-[#1F3C28] transition duration-300 !rounded-button cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Logging in...
            </div>
          ) : (
            "Login"
          )}
        </button>
        {errors.loginError && (
          <p className="text-red-500 text-sm text-center mt-2">
            {errors.loginError}
          </p>
        )}
        <div className="relative flex items-center justify-center mt-6">
          <div className="absolute border-t border-gray-300 w-full"></div>
          <div className="relative bg-white px-4 text-sm text-gray-500">
            Or continue with
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
          Dont have an account?{" "}
          <button
            onClick={() => setActiveTab("signup")}
            className="text-[#2D5339] font-medium hover:text-[#1F3C28] cursor-pointer whitespace-nowrap"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;