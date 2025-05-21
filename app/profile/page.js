"use client";

import { useSession, signOut } from "next-auth/react";
import Layout from "../components/Layout";
import { FaUserEdit, FaKey, FaSignOutAlt } from "react-icons/fa";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-pulse text-gray-500 text-xl">
            Loading profile...
          </div>
        </div>
      </Layout>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-white">
          <p className="text-red-500 text-lg font-semibold">
            You must be signed in to view this page.
          </p>
        </div>
      </Layout>
    );
  }

  const { user } = session;

  return (
    <Layout>
      <div className="min-h-screen bg-[#e7e6d4] py-16 px-6 flex items-center justify-center">
        <div className="w-full max-w-3xl bg-[#efefed] rounded-3xl shadow-xl border border-gray-200 p-8 md:p-12 transition-all duration-300">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            {user?.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="mt-4 text-3xl font-extrabold text-gray-800">
              {user?.name}
            </h1>
            <p className="text-gray-600">{user?.email}</p>
            <span className="mt-2 px-4 py-1 text-sm bg-green-100 text-green-700 rounded-full">
              ✅ Authenticated
            </span>
          </div>

          {/* Settings */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Account Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-medium shadow-sm">
                <FaUserEdit /> Edit Profile
              </button>
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2d5439] text-white hover:bg-[#386e48] transition font-medium shadow-sm">
                <FaKey /> Change Password
              </button>
            </div>
          </div>

          {/* Sign Out */}
          <div className="mt-10 text-center">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md transition transform hover:scale-105"
            >
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
