"use client";
import React from "react";

const OtpVerification = ({
  otpValues,
  handleOtpChange,
  timer,
  timerActive,
  startTimer,
  setActiveTab,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify Email 🔐</h1>
        <p className="text-gray-600">Enter the 6-digit code sent to your email</p>
      </div>
      <div className="space-y-6">
        <div className="flex justify-center gap-2">
          {otpValues.map((value, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ))}
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Didn't receive the code?{" "}
            {timerActive ? (
              <span className="text-gray-500">Resend in {timer}s</span>
            ) : (
              <button
                onClick={startTimer}
                className="text-blue-600 font-medium hover:text-blue-800 cursor-pointer whitespace-nowrap"
              >
                Resend OTP
              </button>
            )}
          </p>
        </div>
        <button
          onClick={() => setActiveTab("reset")}
          className="w-full bg-[#2D5339] text-white py-3 rounded-lg font-medium hover:bg-[#1F3C28] transition duration-300 !rounded-button cursor-pointer whitespace-nowrap"
        >
          Verify
        </button>
        <p className="text-center text-gray-600 text-sm">
          <button
            onClick={() => setActiveTab("forgot")}
            className="text-blue-600 font-medium hover:text-blue-800 cursor-pointer whitespace-nowrap"
          >
            Change email
          </button>
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;