import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkAuth(); 

    router.events?.on('routeChangeComplete', checkAuth);

    return () => {
      router.events?.off('routeChangeComplete', checkAuth);
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="bg-blue-700 text-white px-4 py-3 fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-xl font-semibold">💰 Finance Tracker+</div>
        <div className="flex gap-6">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              <Link href="/expenses" className="hover:underline">Expenses</Link>
              <Link href="/admin" className="hover:underline">Admin</Link>
              <button onClick={handleLogout} className="hover:underline text-red-300">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">Login</Link>
              <Link href="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
