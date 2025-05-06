"use client";
import React from "react";

const SuccessDialog = ({ setShowSuccessDialog, setActiveTab }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-2xl text-green-500"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Registration Successful!
          </h3>
          <p className="text-gray-600 mb-6">
            Your account has been created successfully.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowSuccessDialog(false);
                setActiveTab("login");
              }}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-300 !rounded-button cursor-pointer whitespace-nowrap"
            >
              Go to Login
            </button>
            <button
              onClick={() => setShowSuccessDialog(false)}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition duration-300 !rounded-button cursor-pointer whitespace-nowrap"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessDialog;