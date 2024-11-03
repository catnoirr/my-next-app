"use client";
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Volunteers from '../components/Volunteers';
import { FaUsers, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';


const ALLVolunteers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All'); // Filter state

  return (
    <div className="flex flex-col md:flex-row md:mt-6 md:ml-2">
      {/* Sidebar */}
      <div className="w-full md:w-64 order-1 ">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:ml-6 order-2 rounded-2xl shadow-md md:mt-6">
        <h1 className="text-3xl font-bold mb-4">Volunteers</h1>

        {/* Search Bar */} 
        <input     
          type="text"
          placeholder="Search volunteers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 w-full max-w-md mb-6 border border-gray-300 rounded"
        />

        {/* Sections Row */}
        <div className="flex space-x-4 mb-4">
          <div onClick={() => setFilter('All')} className="flex items-center p-3 bg-gray-100 rounded shadow hover:bg-blue-200 text-sm cursor-pointer">
            <FaUsers className="mr-2" /> All
          </div>
          <div onClick={() => setFilter('Verified')} className="flex items-center p-3 bg-gray-100 rounded shadow hover:bg-green-300 text-sm cursor-pointer">
            <FaCheckCircle className="mr-2" /> Verified
          </div>
          <div onClick={() => setFilter('Unverified')} className="flex items-center p-3 bg-gray-100 rounded shadow hover:bg-red-400 text-sm cursor-pointer">
            <FaTimesCircle className="mr-2" /> Unverified
          </div>
        </div>

        {/* Volunteers Component */}
        <Volunteers filter={filter} searchTerm={searchTerm} />
      </main>
    </div>
  );
};

export default ALLVolunteers;
