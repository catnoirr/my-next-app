// src/app/components/Sidebar.js
'use client'
import { useState } from 'react';
import { FaHome, FaCalendar, FaComments, FaChevronDown, FaChevronRight } from 'react-icons/fa';

export default function Sidebar() {
  const [isDashboardOpen, setDashboardOpen] = useState(true);

  return (
    <div className="w-64 h-screen bg-white p-6 shadow-2xl rounded-3xl transition-all duration-300 transform hover:scale-[1.01]">
      {/* Logo */}
      <div className="flex items-center text-xl font-bold mb-8">
        <span className="text-blue-600 text-4xl font-bold">D</span>
        <span className="ml-3 text-gray-800">Dash UI</span>
      </div>

      {/* Menu */}
      <div>
        {/* Dashboard Section */}
        <div>
          <button
            onClick={() => setDashboardOpen(!isDashboardOpen)}
            className="flex items-center w-full text-gray-700 hover:text-blue-600 py-3 rounded-lg transition-colors duration-200"
          >
            <FaHome className="mr-3 text-blue-600" />
            <span className="text-lg font-medium">Dashboard</span>
            <span className="ml-auto p-1 rounded-full bg-gray-200 text-gray-600 transition-all duration-300">
              {isDashboardOpen ? (
                <FaChevronDown className="transition-transform duration-300 transform rotate-180" />
              ) : (
                <FaChevronRight className="transition-transform duration-300" />
              )}
            </span>
          </button>
          <ul
            className={`ml-8 mt-2 text-gray-600 space-y-2 transition-all duration-300 ease-in-out transform origin-top ${
              isDashboardOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
            } ${isDashboardOpen ? 'max-h-40' : 'max-h-0 overflow-hidden'}`} // Use max-h and overflow
          >
            <li className="cursor-pointer hover:text-blue-600 transition-colors duration-200">Patients Requests</li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors duration-200">Volunteers</li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors duration-200"></li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors duration-200"></li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors duration-200"></li>
            <li className="cursor-pointer hover:text-blue-600 transition-colors duration-200"></li>
          </ul>
        </div>

        {/* Apps Section */}
        <div className="mt-10">
          <h3 className="text-gray-500 uppercase text-xs font-semibold mb-3">Apps</h3>
          <div className="flex items-center py-2 text-gray-700 hover:text-blue-600 cursor-pointer rounded-lg transition-colors duration-200">
            <FaCalendar className="mr-3 text-blue-600" />
            <span className="text-lg font-medium">Calendar</span>
          </div>
          <div className="flex items-center py-2 text-gray-700 hover:text-blue-600 cursor-pointer rounded-lg transition-colors duration-200">
            <FaComments className="mr-3 text-blue-600" />
            <span className="text-lg font-medium">Chat</span>
          </div>
        </div>
      </div>
    </div>
  );
}
