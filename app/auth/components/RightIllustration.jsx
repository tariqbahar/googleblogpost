"use client";
import Image from "next/image";
import React from "react";

const RightIllustration = ({ activeTab }) => {
  return (
    <div className="hidden md:block w-1/2 bg-[#F5F2EA] relative overflow-hidden">
      {activeTab === "login" && (
        <div className="h-full flex items-center justify-center">
          <Image
            src="https://readdy.ai/api/search-image?query=A%20minimalist%203D%20illustration%20of%20a%20modern%20dashboard%20interface%20with%20clean%20lines%20and%20soft%20gradients.%20Features%20elegant%20UI%20elements%2C%20charts%2C%20and%20data%20visualization%20components%20floating%20in%20space.%20The%20design%20emphasizes%20simplicity%20with%20a%20light%20cream%20background%20and%20forest%20green%20accents&width=800&height=1000&seq=1&orientation=portrait"
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {activeTab === "signup" && (
        <div className="h-full flex items-center justify-center">
          <Image
            src="https://readdy.ai/api/search-image?query=A%20sophisticated%203D%20visualization%20of%20an%20analytics%20dashboard%20with%20floating%20geometric%20shapes%20and%20data%20elements.%20The%20design%20features%20a%20professional%20cream%20colored%20background%20with%20forest%20green%20accents%2C%20emphasizing%20modern%20UI%20components%20and%20clean%20information%20hierarchy&width=800&height=1000&seq=2&orientation=portrait"
            alt="Sign Up Illustration"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {activeTab === "forgot" && (
        <div className="h-full flex items-center justify-center">
          <Image
            src="https://readdy.ai/api/search-image?query=A%20minimalist%203D%20illustration%20of%20an%20elegant%20dashboard%20security%20interface%20with%20floating%20authentication%20elements.%20Features%20a%20cream%20colored%20background%20with%20forest%20green%20accents%2C%20showcasing%20modern%20UI%20components%20and%20subtle%20data%20visualization%20elements&width=800&height=1000&seq=3&orientation=portrait"
            alt="Forgot Password Illustration"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {activeTab === "otp" && (
        <div className="h-full flex items-center justify-center">
          <Image
            src="https://readdy.ai/api/search-image?query=A%20clean%203D%20visualization%20of%20a%20verification%20dashboard%20interface%20with%20floating%20number%20elements%20and%20security%20symbols.%20The%20design%20incorporates%20a%20cream%20colored%20background%20with%20forest%20green%20accents%2C%20featuring%20modern%20UI%20components%20and%20subtle%20geometric%20patterns&width=800&height=1000&seq=4&orientation=portrait"
            alt="OTP Verification Illustration"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {activeTab === "reset" && (
        <div className="h-full flex items-center justify-center">
          <Image
            src="https://readdy.ai/api/search-image?query=A%20sophisticated%203D%20illustration%20of%20a%20password%20reset%20dashboard%20interface%20with%20floating%20security%20elements.%20Features%20a%20cream%20colored%20background%20with%20forest%20green%20accents%2C%20showcasing%20modern%20UI%20components%20and%20subtle%20lock%20and%20key%20visualization%20elements&width=800&height=1000&seq=5&orientation=portrait"
            alt="Reset Password Illustration"
            className="w-full h-full object-cover"
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