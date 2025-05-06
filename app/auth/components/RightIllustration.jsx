"use client";
import Image from "next/image";
import React from "react";

const RightIllustration = ({ activeTab }) => {
  return (
    <div className="hidden md:block w-1/2 bg-[#F5F2EA] relative overflow-hidden">
      {activeTab === "login" && (
       <div className="relative w-full h-full">
       <Image
         src="/images/blog/post-01.jpg"
         alt="Login Illustration"
         fill
         className="object-cover"
       />
     </div>
      )}
      {activeTab === "signup" && (
        <div className="relative w-full h-full">
          <Image
            src="/images/blog/post-01.jpg"
            alt="Sign Up Illustration"
            fill
         className="object-cover"
          />
        </div>
      )}
      {activeTab === "forgot" && (
        <div className="relative w-full h-full">
          <Image
            src="/images/blog/post-01.jpg"
            alt="Forgot Password Illustration"
            fill
         className="object-cover"
          />
        </div>
      )}
      {activeTab === "otp" && (
        <div className="relative w-full h-full">
          <Image
            src="/images/blog/post-01.jpg"
            alt="OTP Verification Illustration"
             fill
         className="object-cover"
          />
        </div>
      )}
      {activeTab === "reset" && (
        <div className="relative w-full h-full">
          <Image
            src="/images/blog/post-01.jpg"
            alt="Reset Password Illustration"
            fill
         className="object-cover"
          />
        </div>
      )}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-white text-opacity-80 text-sm">
          © 2025 Company Name. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default RightIllustration;