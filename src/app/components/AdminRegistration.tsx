// src/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { db } from '../firebaseConfig'; // Import Firestore configuration
import { setDoc, doc } from 'firebase/firestore';

export default function AdminRegistration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('admin'); // Default to admin
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Track registration process
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsRegistering(true); // Start the registration process animation

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsRegistering(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), { email, role });

      setSuccessMessage("Successfully registered!");
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: any) {
      switch (err.code) {
        case 'auth/weak-password':
          setError("Password should be at least 6 characters.");
          break;
        case 'auth/email-already-in-use':
          setError("This email is already registered. Please log in.");
          break;
        case 'auth/invalid-email':
          setError("Please enter a valid email address.");
          break;
        default:
          setError("Failed to register. Please try again.");
      }
    } finally {
      setIsRegistering(false); // Stop the animation
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-700 p-6">
      <div
        className={`relative bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-md transform transition duration-500 hover:scale-105 ${
          isRegistering ? 'border-4 border-yellow-400 animate-pulse' : ''
        }`}
      >
        <h2 className="text-4xl font-extrabold text-center text-white tracking-wide mb-4">
          Register as Admin
        </h2>

        {error && <p className="text-red-400 text-center font-semibold mb-4">{error}</p>}
        {successMessage && <p className="text-green-400 text-center font-semibold mb-4">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-semibold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-white rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-white rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-white rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Confirm your password"
            />
          </div>

          <div>
  <label className="block text-white font-semibold mb-1">Select Role</label>
  <select
    value={role}
    onChange={(e) => setRole(e.target.value)}
    className="w-full px-4 py-2 border border-white rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 hover:bg-white/30 transition duration-200 ease-in-out"
  >
    <option value="admin" className="bg-gray-800 text-white hover:bg-gray-700">Admin</option>
    <option value="user" className="bg-gray-800 text-white hover:bg-gray-700">User</option>
  </select>
</div>


          <button
            type="submit"
            className="w-full py-3 mt-4 bg-purple-500 text-white rounded-lg font-semibold text-lg shadow-lg hover:bg-purple-600 transform transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
