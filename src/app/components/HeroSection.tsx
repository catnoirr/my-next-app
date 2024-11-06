"use client";
import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Ensure this is the correct import for your Firestore config

const HeroSection: React.FC = () => {
  const [newRequestsCount, setNewRequestsCount] = useState<number>(0);
  const [assignedActiveCount, setAssignedActiveCount] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [newVolunteersCount, setNewVolunteersCount ,] = useState<number>(0);

  useEffect(() => {
    // Fetch the count of Pending requests
    const fetchNewRequests = () => {
      const q = query(collection(db, "requests"), where("status", "==", "Pending"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setNewRequestsCount(snapshot.size);
      });
      return unsubscribe;
    };

    // Fetch the count of Assigned requests
    const fetchAssignedActive = () => {
      const q = query(collection(db, "requests"), where("status", "==", "Assigned"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setAssignedActiveCount(snapshot.size);
      });
      return unsubscribe;
    };

    // Fetch the count of Completed requests
    const fetchCompleted = () => {
      const q = query(collection(db, "requests"), where("status", "==", "Completed"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setCompletedCount(snapshot.size);
      });
      return unsubscribe;
    };

    // Fetch the count of new volunteers
    const fetchNewVolunteers = () => {
      const q = query(collection(db, "volunteers"), where("role", "==", "volunteer")); // Assuming 'status' tracks if the volunteer is new
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setNewVolunteersCount(snapshot.size);
      });
      return unsubscribe;
    };
    

    // Call all the functions to fetch data
    const unsubscribeNewRequests = fetchNewRequests();
    const unsubscribeAssignedActive = fetchAssignedActive();
    const unsubscribeCompleted = fetchCompleted();
    const unsubscribeNewVolunteers = fetchNewVolunteers();

    // Cleanup function to unsubscribe from snapshots when the component is unmounted
    return () => {
      unsubscribeNewRequests();  // Call the unsubscribe function
      unsubscribeAssignedActive();  // Call the unsubscribe function
      unsubscribeCompleted();  // Call the unsubscribe function
      unsubscribeNewVolunteers();  // Call the unsubscribe function
    };
  }, []);

  return (
    <div className="bg-white -mb-20">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {/* Search input (if needed) */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-purple-600 text-white p-8 h-52 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold">Activities</h1>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bottom-28 relative">
        <div className="bg-white shadow-md rounded-lg p-6 text-center transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">New Request</h2>
          <p className="text-3xl font-bold text-gray-900">{newRequestsCount}</p>
          <p className="text-gray-500">{newRequestsCount} Pending</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">Assigned Active</h2>
          <p className="text-3xl font-bold text-gray-900">{assignedActiveCount}</p>
          <p className="text-gray-500">{assignedActiveCount} Active</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">Completed</h2>
          <p className="text-3xl font-bold text-gray-900">{completedCount}</p>
          <p className="text-gray-500">{completedCount} Completed</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">New Volunteers</h2>
          <p className="text-3xl font-bold text-gray-900">{newVolunteersCount}</p>
          <p className="text-green-500">{newVolunteersCount} New</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
