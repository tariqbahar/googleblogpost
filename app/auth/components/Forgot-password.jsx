"use client";
import React from "react";

const ForgotPassword = ({ email, setEmail, setActiveTab, startTimer }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
        <p className="text-gray-600">Enter your email to receive a verification code</p>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <input
            type="email"
            id="forgot-email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <i className="fas fa-envelope absolute right-3 top-3.5 text-gray-400"></i>
        </div>
        <button
          onClick={() => {
            setActiveTab("otp");
            startTimer();
          }}
          className="w-full bg-[#2D5339] text-white py-3 rounded-lg font-medium hover:bg-[#1F3C28] transition duration-300 !rounded-button cursor-pointer whitespace-nowrap"
        >
          Send OTP
        </button>
        <p className="text-center text-gray-600 text-sm mt-6">
          Remember your password?{" "}
          <button
            onClick={() => setActiveTab("login")}
            className="text-blue-600 font-medium hover:text-blue-800 cursor-pointer whitespace-nowrap"
          >
            Back to login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;