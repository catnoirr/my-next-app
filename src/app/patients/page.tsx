"use client";
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Patients from '../components/Patients';
import { FaUsers, FaCheckCircle, FaTimesCircle, FaUser } from 'react-icons/fa';

const ALLPatients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All'); // New state for filter

  return (
    <div className="flex flex-col md:flex-row md:gap-6 md:mt-6 ">
      {/* Sidebar */}
      <div className="w-full md:w-64 md:ml-2">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold mb-4">Users</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 w-full max-w-md mb-6 border border-gray-300 rounded"
        />

        {/* Sections Row */}
        <div className="flex  md:space-x-2  space-x-2 mb-4">
          <div onClick={() => setFilter('All')} className="flex items-center p-3 bg-gray-100 rounded shadow hover:bg-blue-200 text-sm cursor-pointer">
            <FaUsers className="" /> All
          </div>
          <div onClick={() => setFilter('Assigned')} className="flex items-center p-3 bg-gray-100 rounded shadow hover:bg-green-300 text-sm cursor-pointer">
            <FaCheckCircle className="" /> Assigned
          </div>
          <div onClick={() => setFilter('Pending')} className="flex items-center p-3 bg-gray-100 rounded shadow hover:bg-red-400 text-sm cursor-pointer">
            <FaTimesCircle className="" /> Pending
          </div>
          <div onClick={() => setFilter('Completed')} className="flex items-center p-3 bg-gray-100 rounded shadow hover:bg-blue-500 text-sm cursor-pointer">
            <FaUser className="" /> Completed
          </div>
        </div>

        {/* Patients Component */}
        <Patients filter={filter} searchTerm={searchTerm} />
      </main>
    </div>
  );
};

export default ALLPatients;
