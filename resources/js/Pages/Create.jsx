import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Toast from "@/Components/Toast";
import axios from "axios";
import JsonEditor from "@/Components/JsonEditor";
import Navbar from "@/Components/Navbar";
export default function Create() {
    const { auth } = usePage().props;
    const [toast, setToast] = useState(null);
    const [route, setRoute] = useState("");
    const [routeError, setRouteError] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [format, setFormat] = useState("json");
    const [methods, setMethods] = useState(["GET"]);
    const [data, setData] = useState('{\n  "example": "value"\n}');
    const [password, setPassword] = useState("");

    const handleRouteChange = (e) => {
        const value = e.target.value;
        setRoute(value);

        if (!value.startsWith("/")) {
            setRouteError("Route jāuzsāk ar '/'!");
        } else if (value.length > 255) {
            setRouteError("Route ir pārāk garš (max 255)!");
        } else if (!/^\/[a-zA-Z0-9_-]+$/.test(value)) {
            setRouteError(
                "Route var saturēt tikai burtus, ciparus, '-' vai '_'"
            );
        } else {
            setRouteError("");
        }
    };

    const handleMethodChange = (method) => {
        setMethods((prev) =>
            prev.includes(method)
                ? prev.filter((m) => m !== method)
                : [...prev, method]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (routeError) {
            setToast({ message: routeError, type: "error" });
            return;
        }

        if (!methods.length) {
            setToast({
                message: "Jāatzīmē vismaz viena metode!",
                type: "error",
            });
            return;
        }
        if (isPrivate && !password) {
            setToast({ message: "Privātam API nepieciešama parole!", type: "error" });
            return;
        }

        let schemaObj;
        try {
            schemaObj = JSON.parse(data);
        } catch (err) {
            setToast({ message: "JSON nav derīgs!", type: "error" });
            return;
        }

        const payload = {
            route,
            visibility: isPrivate ? "private" : "public",
            password: isPrivate ? password : null,
            format,
            allow_get: methods.includes("GET"),
            allow_post: methods.includes("POST"),
            allow_put: methods.includes("PUT"),
            allow_delete: methods.includes("DELETE"),
            schema: schemaObj,
        };

        axios
            .post("/api-resources", payload)
            .then(() => {
                setToast({ message: "API saglabāts!", type: "success" });
                setRoute("");
                setIsPrivate(false);
                setPassword("");
                setFormat("json");
                setMethods(["GET"]);
                setData('{\n  "example": "value"\n}');
            })
            .catch((err) => {
                const msg =
                    err.response?.data?.message || "Kļūda saglabājot API";
                setToast({ message: msg, type: "error" });
            });
    };

    return (
        <>
            <Head title="Create" />
            <div className="min-h-screen bg-gray-50 text-black">
                <Navbar auth={auth} />
                <main className="pt-24 max-w mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white rounded-2xl shadow p-8 space-y-6"
                        >
                            <h2 className="text-2xl font-bold mb-4">
                                API Konfigurācija
                            </h2>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Route
                                </label>
                                <input
                                    type="text"
                                    value={route}
                                    onChange={handleRouteChange}
                                    placeholder="/mans-api"
                                    className={`w-full border rounded-lg p-2 focus:ring ${routeError
                                            ? "border-red-500 focus:ring-red-400"
                                            : "border-gray-300 focus:ring-black"
                                        }`}
                                />
                                {routeError && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {routeError}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={isPrivate}
                                    onChange={(e) =>
                                        setIsPrivate(e.target.checked)
                                    }
                                    id="private"
                                    className="h-4 w-4"
                                />
                                <label
                                    htmlFor="private"
                                    className="text-sm font-medium"
                                >
                                    Privāts API
                                </label>
                            </div>
                              {/* PASSWORD FIELD */}
                              <AnimatePresence>
                                {isPrivate && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-1"
                                    >
                                        <label className="block text-sm font-semibold">
                                            Parole
                                        </label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Ievadi API paroli"
                                            className="w-full border rounded-xl px-3 py-2 shadow-sm border-gray-300 focus:ring-2 focus:ring-black transition"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Datu formāts
                                </label>
                                <select
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                    className="w-full border rounded-lg p-2"
                                >
                                    <option value="json">JSON</option>
                                    <option value="xml">XML</option>
                                    <option value="csv">CSV</option>
                                </select>
                            </div>

                            <div>
                                        <label className="block text-sm font-medium mb-3">
                                            Atļautās metodes
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {["GET", "POST", "PUT", "DELETE"].map(
                                                (method) => (
                                                    <label
                                                        key={method}
                                                        className="relative cursor-pointer group"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={methods.includes(method)}
                                                            onChange={() => handleMethodChange(method)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className={`
                                                            flex items-center justify-center
                                                            h-12 px-4 rounded-xl border-2 
                                                            font-semibold text-sm
                                                            transition-all duration-200
                                                            ${methods.includes(method)
                                                                ? 'bg-green-50 border-green-500 text-green-700 shadow-md shadow-green-100'
                                                                : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                                                            }
                                                        `}>
                                                            <div className="flex items-center gap-2">
                                                                {methods.includes(method) && (
                                                                    <svg 
                                                                        className="w-4 h-4 text-green-600" 
                                                                        fill="none" 
                                                                        stroke="currentColor" 
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path 
                                                                            strokeLinecap="round" 
                                                                            strokeLinejoin="round" 
                                                                            strokeWidth={2.5} 
                                                                            d="M5 13l4 4L19 7" 
                                                                        />
                                                                    </svg>
                                                                )}
                                                                <span className={methods.includes(method) ? 'text-green-700' : 'text-gray-600'}>
                                                                    {method}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </label>
                                                )
                                            )}
                                        </div>
                                    </div>

                            <button
                                type="submit"
                                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-black/90 transition"
                            >
                                Saglabāt API
                            </button>
                        </form>

                        <JsonEditor format={format} data={data} setData={setData} />

                    </div>

                    {toast && (
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast(null)}
                        />
                    )}
                </main>
            </div>
        </>
    );
}
