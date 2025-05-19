"use client";

import React from "react";

export default function ConfirmDialog({
  isOpen,
  type = "default",
  title = "Are you sure?",
  children,
  onConfirm,
  onCancel,
  onClose,
  onRequestClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
        <div className="text-sm text-gray-600 mb-6">{children}</div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              onCancel?.();
              onClose?.();
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
            className={`px-4 py-2 text-white rounded ${
              type === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Confirm
          </button>
        </div>

        {/* Close on backdrop click */}
        <div
          onClick={onRequestClose}
          className="absolute top-0 right-0 p-4 cursor-pointer text-gray-400 hover:text-gray-600"
        >
          &times;
        </div>
      </div>
    </div>
  );
}
