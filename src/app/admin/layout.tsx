"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-blue-100">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          {/* <Link 
            href="/admin" 
            className={`px-4 py-3 rounded-lg transition-all ${pathname === '/admin' ? 'bg-blue-600 text-white font-medium' : 'text-blue-100 hover:bg-blue-700 hover:text-white'}`}
          >
            Dashboard
          </Link> */}
          <Link 
            href="/admin/properties" 
            className={`px-4 py-3 rounded-lg transition-all ${pathname.startsWith('/admin/properties') ? 'bg-blue-600 text-white font-medium' : 'text-blue-100 hover:bg-blue-700 hover:text-white'}`}
          >
            Properties
          </Link>
          <Link 
            href="/admin/bookings" 
            className={`px-4 py-3 rounded-lg transition-all ${pathname.startsWith('/admin/bookings') ? 'bg-blue-600 text-white font-medium' : 'text-blue-100 hover:bg-blue-700 hover:text-white'}`}
          >
            Bookings
          </Link>
          <Link 
            href="/admin/comments" 
            className={`px-4 py-3 rounded-lg transition-all ${pathname.startsWith('/admin/comments') ? 'bg-blue-600 text-white font-medium' : 'text-blue-100 hover:bg-blue-700 hover:text-white'}`}
          >
            Comments
          </Link>
          <Link 
            href="/admin/content" 
            className={`px-4 py-3 rounded-lg transition-all ${pathname.startsWith('/admin/content') ? 'bg-blue-600 text-white font-medium' : 'text-blue-100 hover:bg-blue-700 hover:text-white'}`}
          >
            Content
          </Link>
        </nav>
        
        <div className="mt-8 pt-6 border-t border-blue-700">
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
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}