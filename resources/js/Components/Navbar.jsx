import { Code2, Menu } from "lucide-react";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        axios.post("/logout").then(() => (window.location.href = "/"));
    };

    return (
<nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 fixed w-full z-50">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <a href="/"><Code2 className="w-5 h-5 text-white" /></a>
                        </div>
                        <a href="/"><span className="text-xl font-bold">API Builder</span></a>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-2">
                        <a href="/docs" className="relative px-4 py-2 text-gray-600 hover:text-black font-medium transition-all duration-200 rounded-full hover:bg-gray-100 group">
                            <span className="relative z-10">Dokumentācija</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                        </a>
                        <a href="/Create" className="relative px-4 py-2 text-gray-600 hover:text-black font-medium transition-all duration-200 rounded-full hover:bg-gray-100 group">
                            <span className="relative z-10">Create</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                        </a>
                        <a href="/public-apis" className="relative px-4 py-2 text-gray-600 hover:text-black font-medium transition-all duration-200 rounded-full hover:bg-gray-100 group">
                            <span className="relative z-10">Visi API</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                        </a>
                        {auth?.user && (
                            <a href="/maniapi" className="relative px-4 py-2 text-gray-600 hover:text-black font-medium transition-all duration-200 rounded-full hover:bg-gray-100 group">
                                <span className="relative z-10">Mani API</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                            </a>
                        )}
                    </div>

                    {/* User Section */}
                    <div className="flex items-center gap-3">
                        {/* Desktop User Info (hidden on mobile) */}
                        {auth?.user && (
                            <div className="hidden md:flex items-center gap-2">
                                <span className="text-sm text-gray-600">Sveiki,</span>
                                <span className="font-medium text-gray-800">{auth.user.name}</span>
                            </div>
                        )}

                        {/* User Dropdown or Login */}
                        <div className="relative" ref={dropdownRef}>
                            {auth?.user ? (
                                <div>
                                    {/* Avatar Donut */}
                                    <div 
                                        className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200"
                                        onClick={() => setDropdownOpen(prev => !prev)}
                                    >
                                        {auth.user.avatar ? (
                                            <img 
                                                src={auth.user.avatar} 
                                                alt="avatar" 
                                                className="w-full h-full rounded-full object-cover" 
                                            />
                                        ) : (
                                            <span className="text-white font-semibold text-sm">
                                                {auth.user.name?.charAt(0)?.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Dropdown Menu */}
                                    <div className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200 origin-top-right ${
                                        dropdownOpen 
                                            ? 'opacity-100 scale-100 translate-y-0' 
                                            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                    }`}>
                                        <div className="py-1">
                                            <a 
                                                href="/profile" 
                                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                                            >
                                                <div className="w-5 h-5 mr-3 rounded bg-blue-100 flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                Profils
                                            </a>
                                            <hr className="border-gray-100"/>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                                            >
                                                <div className="w-5 h-5 mr-3 rounded bg-red-100 flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                </div>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <a 
                                    href="/login" 
                                    className="text-gray-700 hover:text-black font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-gray-50"
                                >
                                    <span className="hidden sm:inline">Piereģistrēties / </span>Login
                                </a>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden ml-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => setMobileMenuOpen(prev => !prev)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden bg-white border-t border-gray-200 transition-all duration-300 overflow-hidden ${
                mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
            }`}>
                <div className="px-4 pt-2 pb-4 space-y-1">
                    <a href="/docs" className="group flex items-center text-gray-600 hover:text-black py-3 px-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-200 font-medium">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        Dokumentācija
                    </a>
                    <a href="/Create" className="group flex items-center text-gray-600 hover:text-black py-3 px-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 rounded-xl transition-all duration-200 font-medium">
                        <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        Create
                    </a>
                    <a href="/public-apis" className="group flex items-center text-gray-600 hover:text-black py-3 px-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-200 font-medium">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        Visi API
                    </a>
                    {auth?.user && (
                        <a href="/maniapi" className="group flex items-center text-gray-600 hover:text-black py-3 px-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 rounded-xl transition-all duration-200 font-medium">
                            <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                            Mani API
                        </a>
                    )}
                </div>
            </div>
        </nav>
    );
}