import { Code2, Menu } from "lucide-react";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    // aizver dropdown klikšķa ārpusē
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
        <nav className="bg-white border-b border-gray-200 fixed w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <Code2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">API Builder</span>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <a href="/docs" className="text-gray-700 hover:text-black">Dokumentācija</a>
                        <a href="/Create" className="text-gray-700 hover:text-black">Create</a>
                        <a href="/public-apis" className="text-gray-700 hover:text-black">Visi API</a>
                        {auth?.user && (
                            <a href="/maniapi" className="text-gray-700 hover:text-black">Mani API</a>
                        )}
                    </div>

                    {/* User / Login */}
                    <div className="relative" ref={dropdownRef}>
                        {auth?.user ? (
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setDropdownOpen(prev => !prev)}>
                                {auth.user.avatar && (
                                    <img src={auth.user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                                )}
                                <span className="font-medium">{auth.user.name}</span>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                                        <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profils</a>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <a href="/login" className="text-gray-700 hover:text-black font-medium transition">Piereģistrēties / Login</a>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden ml-2"
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white border-t border-gray-200">
                    <a href="/docs" className="block text-gray-700 hover:text-black">Dokumentācija</a>
                    <a href="/Create" className="block text-gray-700 hover:text-black">Create</a>
                    <a href="/public-apis" className="block text-gray-700 hover:text-black">Visi API</a>
                    {auth?.user && (
                        <a href="/maniapi" className="block text-gray-700 hover:text-black">Mani API</a>
                    )}
                </div>
            )}
        </nav>
    );
}
