import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function ApiForm({ onToast, data, setData }) {
    const [route, setRoute] = useState("");
    const [routeError, setRouteError] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [format, setFormat] = useState("json");
    const [methods, setMethods] = useState(["GET"]);
    const [password, setPassword] = useState("");

    const handleRouteChange = (e) => {
        let value = e.target.value;
    
        if (value && !value.startsWith("/")) {
            value = "/" + value;
        }
    
        setRoute(value);
    
        if (value.length > 255) {
            setRouteError("Route ir pārāk garš (max 255)!");
        } else if (!/^\/[a-zA-Z0-9_-]+$/.test(value)) {
            setRouteError("Route var saturēt tikai burtus, ciparus, '-' vai '_'");
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

    const resetForm = () => {
        setRoute("");
        setIsPrivate(false);
        setPassword("");
        setFormat("json");
        setMethods(["GET"]);
        setData('{\n  "example": "value"\n}');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (routeError) {
            onToast({ message: routeError, type: "error" });
            return;
        }

        if (!methods.length) {
            onToast({ message: "Jāatzīmē vismaz viena metode!", type: "error" });
            return;
        }

        if (isPrivate && !password) {
            onToast({ message: "Privātam API nepieciešama parole!", type: "error" });
            return;
        }

        let schemaObj;
        try {
            schemaObj = JSON.parse(data);
        } catch (err) {
            onToast({ message: "JSON nav derīgs!", type: "error" });
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
                onToast({ message: "API saglabāts!", type: "success" });
                resetForm();
            })
            .catch((err) => {
                const msg = err.response?.data?.message || "Kļūda saglabājot API";
                onToast({ message: msg, type: "error" });
            });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl shadow-gray-200/50 p-8 space-y-7 border border-gray-100"
        >
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    API Konfigurācija
                </h2>
                <p className="text-sm text-gray-500 mt-1">Izveido savu pielāgoto API galapunktu</p>
            </div>

            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Route
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={route}
                        onChange={handleRouteChange}
                        placeholder="/mans-api"
                        className={`w-full border-2 rounded-xl p-3 pl-4 transition-all duration-200
                            ${routeError
                                ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                                : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            }
                            outline-none font-mono text-sm`}
                    />
                </div>
                <AnimatePresence>
                    {routeError && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-red-500 text-xs mt-2 flex items-center gap-1"
                        >
                            <span className="font-bold">⚠</span> {routeError}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                            id="private"
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-blue-500 transition-all duration-300 shadow-inner"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5 shadow-md"></div>
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-gray-800">Privāts API</span>
                        <p className="text-xs text-gray-600">Pieprasa autentifikāciju</p>
                    </div>
                </label>
            </div>

            <AnimatePresence>
                {isPrivate && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-2">
                            <label className="block text-sm font-semibold text-purple-900">
                                🔒 Parole
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ievadi API paroli"
                                className="w-full border-2 border-purple-200 rounded-xl px-4 py-2.5 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Datu formāts
                </label>
                <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 px-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all cursor-pointer bg-white"
                >
                    <option value="json">📄 JSON</option>
                    <option value="xml">📋 XML</option>
                    <option value="yaml">📝 YAML</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">
                    Atļautās metodes
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { method: "GET", color: "blue" },
                        { method: "POST", color: "green" },
                        { method: "PUT", color: "amber" },
                        { method: "DELETE", color: "red" }
                    ].map(({ method, color }) => (
                        <label key={method} className="relative cursor-pointer">
                            <input
                                type="checkbox"
                                checked={methods.includes(method)}
                                onChange={() => handleMethodChange(method)}
                                className="sr-only peer"
                            />
                            <div
                                className={`flex items-center justify-center
                                    h-14 px-4 rounded-xl border-2 
                                    font-bold text-sm
                                    transition-all duration-200
                                    transform hover:scale-105
                                    ${methods.includes(method)
                                        ? `bg-gradient-to-br from-${color}-50 to-${color}-100 border-${color}-400 text-${color}-700 shadow-lg shadow-${color}-200/50`
                                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:shadow-md"
                                    }`}
                            >
                                <span className="mr-2">{methods.includes(method) ? "✓" : ""}</span>
                                {method}
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white py-4 rounded-xl font-bold text-base hover:from-gray-800 hover:to-gray-600 transition-all shadow-lg shadow-gray-400/30 hover:shadow-xl hover:shadow-gray-400/40"
            >
                ✨ Saglabāt API
            </motion.button>
        </form>
    );
}