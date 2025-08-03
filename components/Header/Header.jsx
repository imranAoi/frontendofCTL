'use client';
import Link from "next/link";
import { Button } from "../ui/button";
import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white flex items-center justify-between px-8 py-4 border-b shadow-sm">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-bold">todoist</Link>
        {isAuthenticated() && (
          <nav className="hidden md:flex gap-1 space-x-2 text-gray-600">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="#">Tasks</Link>
            <Link href="#">Projects</Link>
          </nav>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {isAuthenticated() ? (
          <>
            <span className="text-gray-600">
              Welcome, {user?.displayName || user?.name || user?.email}
            </span>
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Log in
            </Link>
            <Link href="/login">
              <Button variant="default">Start for free</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
