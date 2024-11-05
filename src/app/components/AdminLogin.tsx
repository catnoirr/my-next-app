// src/app/components/AdminLogin.tsx
'use client';

import { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // Import js-cookie for setting cookies
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Firestore functions
import { FirebaseError } from 'firebase/app'; // Import FirebaseError for error handling

const db = getFirestore(); // Initialize Firestore

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for border effect
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Authenticate with Firebase using email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      const userId = userCredential.user.uid;

      // Retrieve the user's role from Firestore
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();

      if (userData?.role === 'admin') {
        // Set the auth token in cookies
        Cookies.set('authToken', token, { expires: 1, secure: true, sameSite: 'Strict' });
        // Redirect to dashboard on successful login
        router.push('/dashboard');
      } else {
        setError('Access denied. Admin only.');
        auth.signOut(); // Sign out the user if not an admin
        setLoading(false);
      }
    } catch (err) {
      // Here, 'err' is used for logging or displaying the error message
      const firebaseError = err as FirebaseError; // Cast to FirebaseError
      setError(firebaseError.message || 'Invalid email or password. Please try again.'); // Use firebase error message
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-700 p-6">
      <div
        className={`bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-md transform transition duration-500 hover:scale-105 ${
          loading ? 'border-lightning' : ''
        }`} // Apply border effect conditionally
      >
        <h2 className="text-4xl font-extrabold text-center text-white tracking-wide mb-4">
          {showForgotPassword ? 'Reset Password' : 'Admin Login'}
        </h2>

        {error && <p className="text-red-400 text-center font-semibold mb-4">{error}</p>}

        {showForgotPassword ? (
          <ForgotPasswordForm onClose={() => setShowForgotPassword(false)} />
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
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

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-purple-500 text-white rounded-lg font-semibold text-lg shadow-lg hover:bg-purple-600 transform transition duration-300"
            >
              Log In
            </button>
          </form>
        )}

        {!showForgotPassword && (
          <p className="text-center mt-4 text-purple-200">
            <button
              onClick={() => setShowForgotPassword(true)}
              className="hover:underline transition"
            >
              Forgot Password?
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

// ForgotPasswordForm Component
function ForgotPasswordForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setVerificationSent(true);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      const firebaseError = err as FirebaseError; // Cast to FirebaseError
      setError(firebaseError.message || 'Failed to send reset email. Try again.');
    }
  };

  return (
    <div className="mt-6 bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg">
      {verificationSent ? (
        <div className="space-y-4 text-center text-white">
          <p className="text-green-400 font-semibold">{message}</p>
          <button
            onClick={onClose}
            className="w-full py-3 mt-4 bg-purple-500 text-white rounded-lg font-semibold shadow-md hover:bg-purple-600 transition"
          >
            Back to Login
          </button>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-bold text-white">Reset Your Password</h3>
          {error && <p className="text-red-400 mt-2">{error}</p>}
          <form onSubmit={handlePasswordReset} className="space-y-4 mt-4">
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
            <button
              type="submit"
              className="w-full py-3 bg-purple-500 text-white rounded-lg font-semibold shadow-lg hover:bg-purple-600 transform transition duration-300"
            >
              Send Reset Email
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 mt-2 bg-gray-400 text-gray-800 rounded-lg font-semibold shadow-md hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </form>
        </>
      )}
    </div>
  );
}
