// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '..//app/firebaseConfig'; // Import your Firebase configuration
import AdminLogin from './components/AdminLogin';
import { FaSpinner } from 'react-icons/fa'; // Import spinner icon

export default function HomePage() {
  const [loading, setLoading] = useState(true); // State to track loading status
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // If user is authenticated, redirect to the dashboard
        router.push('/dashboard');
      } else {
        // If not authenticated, stop loading
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-700">
        <div className="flex flex-col items-center text-white">
          <FaSpinner className="animate-spin text-4xl mb-4" /> {/* Spinner icon */}
          <p className="text-lg">Loading, please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <AdminLogin />
    </main>
  );
}
