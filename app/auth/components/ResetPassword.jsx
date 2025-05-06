"use client";
import React from "react";

const ResetPassword = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  setActiveTab,
  renderPasswordStrength,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
        <p className="text-gray-600">Create a new secure password</p>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <input
            type="password"
            id="new-password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i className="fas fa-lock absolute right-3 top-3.5 text-gray-400"></i>
        </div>
        {renderPasswordStrength()}
        <div className="relative mt-4">
          <input
            type="password"
            id="confirm-password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <i className="fas fa-lock absolute right-3 top-3.5 text-gray-400"></i>
        </div>
        {confirmPassword && (
          <p
            className={`text-xs ${password === confirmPassword ? "text-green-600" : "text-red-600"}`}
          >
            {password === confirmPassword
              ? "Passwords match"
              : "Passwords do not match"}
          </p>
        )}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Password requirements:
          </h3>
          <ul className="text-xs text-gray-600 space-y-1 ml-5 list-disc">
            <li className={password.length >= 8 ? "text-green-600" : ""}>
              At least 8 characters
            </li>
            <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>
              At least one uppercase letter
            </li>
            <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>
              At least one number
            </li>
            <li
              className={
                /[^A-Za-z0-9]/.test(password) ? "text-green-600" : ""
              }
            >
              At least one special character
            </li>
          </ul>
        </div>
        <button
          onClick={() => setActiveTab("login")}
          className="w-full bg-[#2D5339] text-white py-3 rounded-lg font-medium hover:bg-[#1F3C28] transition duration-300 mt-4 !rounded-button cursor-pointer whitespace-nowrap"
          disabled={
            password !== confirmPassword ||
            getPasswordStrength(password) < 3
          }
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;