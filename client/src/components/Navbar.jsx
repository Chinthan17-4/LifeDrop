import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Bell, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const donorLinks = [
    { to: "/donor/dashboard", label: "Dashboard" },
    { to: "/find-donors", label: "Find Donors" },
    { to: "/map", label: "Map" },
    { to: "/chatbot", label: "AI Assistant" },
  ];
  const recipientLinks = [
    { to: "/recipient/dashboard", label: "Dashboard" },
    { to: "/find-donors", label: "Find Donors" },
    { to: "/recipient/create-request", label: "Request Blood" },
    { to: "/recipient/my-requests", label: "My Requests" },
    { to: "/map", label: "Map" },
    { to: "/chatbot", label: "AI Assistant" },
  ];
  const links = user?.role === "donor" ? donorLinks : recipientLinks;
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/60 shadow-[0_1px_12px_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={user ? (user.role === "donor" ? "/donor/dashboard" : "/recipient/dashboard") : "/"}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 bg-[#C62828] rounded-lg flex items-center justify-center shadow-[0_2px_8px_rgba(198,40,40,0.4)]">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">LifeDrop</span>
          </Link>

          {/* Desktop nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive(link.to)
                      ? "bg-[#C62828]/10 text-[#C62828] shadow-sm"
                      : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-xl hover:bg-white/60 transition-all"
                >
                  <Bell className="w-5 h-5 text-gray-500" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C62828] text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-sm">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-white/60 transition-all"
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-[#C62828] to-[#8E0000] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {user.name?.slice(0, 2).toUpperCase() || "U"}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700 max-w-24 truncate">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/60 py-1.5 z-50">
                      <div className="px-4 py-2.5 border-b border-gray-100/80">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 capitalize mt-0.5">{user.role}</p>
                      </div>
                      <Link
                        to={user.role === "donor" ? "/donor/dashboard" : "/recipient/dashboard"}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50/80 transition-colors"
                      >
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50/80 w-full text-left transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>

                <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl hover:bg-white/60">
                  {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-gray-500 px-3 py-2 rounded-xl hover:bg-white/60 hover:text-gray-800 transition-all">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {user && menuOpen && (
          <div className="md:hidden border-t border-gray-100/60 py-2 pb-4 space-y-0.5">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 text-sm font-medium rounded-xl mx-1 transition-all ${
                  isActive(link.to)
                    ? "bg-[#C62828]/10 text-[#C62828]"
                    : "text-gray-600 hover:bg-white/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
