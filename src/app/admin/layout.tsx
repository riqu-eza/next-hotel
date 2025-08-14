"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// Utility function to generate time-based password
function generateTimeBasedPassword(): string {
  const now = new Date();
  const password = now.getFullYear().toString() +
                  (now.getMonth() + 1).toString().padStart(2, '0') +
                  now.getDate().toString().padStart(2, '0') +
                  now.getHours().toString().padStart(2, '0') +
                  now.getMinutes().toString().padStart(2, '0');
  return password; // Format: YYYYMMDDHHMM
}

// Custom hook for authentication
function useTimeBasedAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [inputPassword, setInputPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    // Check if user is already authenticated in this session
    const authStatus = sessionStorage.getItem('admin-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      setShowLoginModal(true);
    }

    // Update current time every second for display
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const validatePassword = (password: string): boolean => {
    const currentPassword = generateTimeBasedPassword();
    
    // Also check password from previous minute to handle timing delays
    const previousMinute = new Date();
    previousMinute.setMinutes(previousMinute.getMinutes() - 1);
    const previousPassword = previousMinute.getFullYear().toString() +
                            (previousMinute.getMonth() + 1).toString().padStart(2, '0') +
                            previousMinute.getDate().toString().padStart(2, '0') +
                            previousMinute.getHours().toString().padStart(2, '0') +
                            previousMinute.getMinutes().toString().padStart(2, '0');
    
    return password === currentPassword || password === previousPassword;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validatePassword(inputPassword)) {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setError("");
      sessionStorage.setItem('admin-auth', 'true');
    } else {
      setError("Invalid password. Use current date/time format: YYYYMMDDHHMM");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLoginModal(true);
    setInputPassword("");
    setError("");
    sessionStorage.removeItem('admin-auth');
  };

  return {
    isAuthenticated,
    showLoginModal,
    inputPassword,
    setInputPassword,
    error,
    currentTime,
    handleLogin,
    handleLogout
  };
}

// Login Modal Component
function LoginModal({ 
  show, 
  inputPassword, 
  setInputPassword, 
  error, 
  currentTime, 
  onSubmit 
}: {
  show: boolean;
  inputPassword: string;
  setInputPassword: (value: string) => void;
  error: string;
  currentTime: string;
  onSubmit: (e: React.FormEvent) => void;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Access Required</h2>
          {/* <p className="text-gray-600">Enter the time-based password to continue</p> */}
        </div>
        
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 mb-1">Current Time:</p>
          <p className="font-mono text-blue-800">{currentTime}</p>
          
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
           
            <input
              type="password"
              id="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="202508141432"
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Access Admin Panel
          </button>
        </form>
        
        {/* <div className="mt-4 text-xs text-gray-500 text-center">
          Hint: Use current date and time in YYYYMMDDHHMM format
        </div> */}
      </div>
    </div>
  );
}

// Updated Admin Layout Component
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const {
    isAuthenticated,
    showLoginModal,
    inputPassword,
    setInputPassword,
    error,
    currentTime,
    handleLogin,
    handleLogout
  } = useTimeBasedAuth();

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <LoginModal
          show={showLoginModal}
          inputPassword={inputPassword}
          setInputPassword={setInputPassword}
          error={error}
          currentTime={currentTime}
          onSubmit={handleLogin}
        />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Please authenticate to continue</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-blue-100">Admin Panel</h2>
        
        <nav className="flex flex-col gap-2">
          <Link
            href="/admin/properties"
            className={`px-4 py-3 rounded-lg transition-all ${
              pathname.startsWith('/admin/properties') 
                ? 'bg-blue-600 text-white font-medium' 
                : 'text-blue-100 hover:bg-blue-700 hover:text-white'
            }`}
          >
            Properties
          </Link>
          
          <Link
            href="/admin/bookings"
            className={`px-4 py-3 rounded-lg transition-all ${
              pathname.startsWith('/admin/bookings') 
                ? 'bg-blue-600 text-white font-medium' 
                : 'text-blue-100 hover:bg-blue-700 hover:text-white'
            }`}
          >
            Bookings
          </Link>
          
          <Link
            href="/admin/comments"
            className={`px-4 py-3 rounded-lg transition-all ${
              pathname.startsWith('/admin/comments') 
                ? 'bg-blue-600 text-white font-medium' 
                : 'text-blue-100 hover:bg-blue-700 hover:text-white'
            }`}
          >
            Comments
          </Link>
          
          <Link
            href="/admin/content"
            className={`px-4 py-3 rounded-lg transition-all ${
              pathname.startsWith('/admin/content') 
                ? 'bg-blue-600 text-white font-medium' 
                : 'text-blue-100 hover:bg-blue-700 hover:text-white'
            }`}
          >
            Content
          </Link>
        </nav>
        
        <div className="mt-8 pt-6 border-t border-blue-700 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-lg transition-all flex items-center gap-2 text-blue-100 hover:bg-red-600 hover:text-white text-left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
          
          <Link
            href="/"
            className="px-4 py-3 rounded-lg transition-all flex items-center gap-2 text-blue-100 hover:bg-amber-800 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
            <h1 className="text-2xl font-bold text-amber-800">Admin Dashboard</h1>
            <p className="text-amber-700">Manage your property listings and bookings</p>
            <p className="text-xs text-amber-600 mt-1">Current time: {currentTime}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

// Updated Admin Dashboard Component
