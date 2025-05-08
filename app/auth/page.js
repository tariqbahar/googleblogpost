"use client";
import { signIn } from 'next-auth/react';
import React, { useState, useEffect } from "react";
import Head from 'next/head';
import LoginForm from './components/Login';
import SignUpForm from './components/Register';
import ForgotPassword from './components/Forgot-password';
import OtpVerification from './components/OtpVerification';
import ResetPassword from './components/Reset-password';
import SuccessDialog from './components/SuccessDialog';
import RightIllustration from './components/RightIllustration';

const App = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const handleLogin = async () => {
    setIsLoading(true);
    setErrors({});
  
    if (!email || !password) {
      setErrors({ loginError: 'Please enter email and password' });
      setIsLoading(false);
      return;
    }
  
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
  
    if (result?.error) {
      setErrors({ loginError: result.error });
    } else {
      window.location.href = '/dashboard';
    }
  
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open(
        "https://accounts.google.com/o/oauth2/v2/auth",
        "Google Sign In",
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (popup) {
        popup.close();
      }
      
      const mockGoogleProfile = {
        email: "user@gmail.com",
        name: "Google User",
        picture: "profile_url",
      };
      
      setEmail(mockGoogleProfile.email);
      setName(mockGoogleProfile.name);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Google sign in failed:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    setErrors({});
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (getPasswordStrength(password) < 3) {
      newErrors.password = "Password does not meet requirements";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    
    if (!acceptTerms) {
      setIsLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setShowSuccessDialog(true);
    setIsLoading(false);
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
      setTimer(60);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timer]);

  const startTimer = () => {
    setTimerActive(true);
  };

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const renderPasswordStrength = () => {
    const strength = getPasswordStrength(password);
    const labels = ["Weak", "Fair", "Good", "Strong"];
    
    return (
      <div className="mt-2">
        <div className="flex gap-1 mb-1">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`h-1 flex-1 rounded-full ${
                level <= strength
                  ? level === 1
                    ? "bg-red-500"
                    : level === 2
                    ? "bg-yellow-500"
                    : level === 3
                    ? "bg-blue-500"
                    : "bg-green-500"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        {password && (
          <p className="text-xs text-gray-600">
            {labels[strength - 1] || "Too weak"}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center p-4">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-bxgWgxVQxwNRhB+0pzXyaTk2bO+L3nkt4RgZJfFrkH+3vFZgOZy9XkYJzHy8KhzH7eIlTujrP2tX+aIVnF14aw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>
      
      {showSuccessDialog && (
        <SuccessDialog
          setShowSuccessDialog={setShowSuccessDialog}
          setActiveTab={setActiveTab}
        />
      )}
      
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row" style={{ minHeight: "600px" }}>
        {/* Left Side - Forms */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white bg-opacity-90 backdrop-blur-sm">
          {activeTab === "login" && (
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              errors={errors}
              isLoading={isLoading}
              isGoogleLoading={isGoogleLoading}
              handleLogin={handleLogin}
              handleGoogleSignIn={handleGoogleSignIn}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "signup" && (
            <SignUpForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              acceptTerms={acceptTerms}
              setAcceptTerms={setAcceptTerms}
              errors={errors}
              isLoading={isLoading}
              isGoogleLoading={isGoogleLoading}
              handleSignUp={handleSignUp}
              handleGoogleSignIn={handleGoogleSignIn}
              setActiveTab={setActiveTab}
              renderPasswordStrength={renderPasswordStrength}
            />
          )}

          {activeTab === "forgot" && (
            <ForgotPassword
              email={email}
              setEmail={setEmail}
              setActiveTab={setActiveTab}
              startTimer={startTimer}
            />
          )}

          {activeTab === "otp" && (
            <OtpVerification
              otpValues={otpValues}
              handleOtpChange={handleOtpChange}
              timer={timer}
              timerActive={timerActive}
              startTimer={startTimer}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "reset" && (
            <ResetPassword
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              setActiveTab={setActiveTab}
              renderPasswordStrength={renderPasswordStrength}
            />
          )}
        </div>
        
        <RightIllustration activeTab={activeTab} />
      </div>
    </div>
  );
};

export default App;