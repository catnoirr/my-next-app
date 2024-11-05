// src/app/components/Sidebar.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome, FaCalendar, FaComments, FaUserInjured, FaHandsHelping, FaSignOutAlt } from 'react-icons/fa';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import Cookies from 'js-cookie';
import { useAuthState } from 'react-firebase-hooks/auth'; // Import the hook

export default function Sidebar() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth); // Get the auth state

  useEffect(() => {
    // If the user is not authenticated, redirect to login
    if (!loading && !user) {
      router.push('/'); // Redirect to the login page
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Remove the authentication token cookie
      Cookies.remove('authToken');

      // Redirect to login page
      router.push('/admin');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="relative flex flex-col justify-between">
      {/* Icons-only bar on smaller screens */}
      <div className="flex justify-around py-4 bg-white shadow-md md:hidden rounded-3xl mt-4 border">
        <button onClick={() => router.push('/dashboard')} className="text-blue-600 ">
          <FaHome size={24} />
        </button>
        <button onClick={() => router.push('/patients')} className="text-blue-600">
          <FaUserInjured size={24} />
        </button>
        <button onClick={() => router.push('/volunteers')} className="text-blue-600">
          <FaHandsHelping size={24} />
        </button>
        <button onClick={() => router.push('/admin')} className="text-blue-600 hidden md:block">
          <FaCalendar size={24} />
        </button>
        <button onClick={() => router.push('/chat')} className="text-blue-600">
          <FaComments size={24} />
        </button>
        <button onClick={handleLogout} className="text-blue-600">
          <FaSignOutAlt size={24} />
        </button>
      </div>

      {/* Full Sidebar for larger screens */}
      <div className="hidden md:flex flex-col w-64 bg-white p-6 shadow-2xl rounded-3xl h-full">
        {/* Logo */}
        <div className="flex items-center text-xl font-bold mb-8">
          <span className="text-blue-600 text-4xl font-bold">D</span>
          <span className="ml-3 text-gray-800">Dash UI</span>
        </div>

        {/* Dashboard Section */}
        <div>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center w-full text-gray-700 hover:text-blue-600 py-3 rounded-lg transition-colors duration-200"
          >
            <FaHome className="mr-3 text-blue-600" />
            <span className="text-lg font-medium">Dashboard</span>
          </button>
        </div>

        {/* Apps Section */}
        <div className="mt-10">
          <h3 className="text-gray-500 uppercase text-xs font-semibold mb-3">Apps</h3>
          <div
            className="flex items-center py-2 text-gray-700 hover:text-blue-600 cursor-pointer rounded-lg transition-colors duration-200"
            onClick={() => router.push('/patients')}
          >
            <FaUserInjured className="mr-3 text-blue-600" />
            <span className="text-lg font-medium">Patients Requests</span>
          </div>
          <div
            className="flex items-center py-2 text-gray-700 hover:text-blue-600 cursor-pointer rounded-lg transition-colors duration-200"
            onClick={() => router.push('/volunteers')}
          >
            <FaHandsHelping className="mr-3 text-blue-600" />
            <span className="text-lg font-medium">Volunteers</span>
          </div>
          <div
            className="flex items-center py-2 text-gray-700 hover:text-blue-600 cursor-pointer rounded-lg transition-colors duration-200"
            onClick={() => router.push('/admin')}
          >
            <FaCalendar className="mr-3 text-blue-600" />
            <span className="text-lg font-medium">Register As Admin</span>
          </div>
          <div
            className="flex items-center py-2 text-gray-700 hover:text-blue-600 cursor-pointer rounded-lg transition-colors duration-200"
            onClick={() => router.push('/chat')}
          >
            <FaComments className="mr-3 text-blue-600" />
            <span className="text-lg font-medium">Chat</span>
          </div>
        </div>

        {/* Logout Button */}
        <div className="md:mt-32">
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-gray-700 hover:text-blue-600 py-3 rounded-lg transition-colors duration-200"
          >
            <FaSignOutAlt className="mr-3 text-blue-600" />
            <span className="text-lg font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
