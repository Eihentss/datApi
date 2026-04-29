import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function ApiForm({ onToast, data, setData }) {
    const [mainRoute, setMainRoute] = useState("");
    const [routeError, setRouteError] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [format, setFormat] = useState("json");
    const [password, setPassword] = useState("");

    const handleRouteChange = (e) => {
        let value = e.target.value;
    
        if (value && !value.startsWith("/")) {
            value = "/" + value;
        }
        setMainRoute(value);
        if (value.length > 255) {
            setRouteError("Route ir pārāk garš (max 255)!");
        } else if (!/^\/[a-zA-Z0-9_/-]+$/.test(value)) {
            setRouteError("Route var saturēt tikai burtus, ciparus, '-', '_' vai '/'");
        } else {
            setRouteError("");
        }
    };

    const resetForm = () => {
        setMainRoute("");
        setIsPrivate(false);
        setPassword("");
        setFormat("json");
        setData('{\n  "example": "value"\n}');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (routeError) {
            onToast({ message: routeError, type: "error" });
            return;
        }
    
        if (!mainRoute) {
            onToast({ message: "Route nevar būt tukšs!", type: "error" });
            return;
        }
    
        if (isPrivate && !password) {
            onToast({ message: "Privātam API nepieciešama parole!", type: "error" });
            return;
        }
    
        // Validē JSON shēmu
        let schemaObj;
        try {
            schemaObj = JSON.parse(data);
        } catch (err) {
            onToast({ message: "JSON nav derīgs!", type: "error" });
            return;
        }
    
        // Izveido payload backendam
        const payload = {
            route: mainRoute,
            format,
            visibility: isPrivate ? "private" : "public",
            password: isPrivate ? password : null,
            schema: schemaObj,
        };
    
        try {
            await axios.post("/api-resources", payload);
    
            onToast({
                message: `API saglabāts veiksmīgi!`,
                type: "success",
            });
            resetForm();
        } catch (err) {
            const msg = err.response?.data?.message || "Kļūda saglabājot API";
            onToast({ message: msg, type: "error" });
        }
    };
    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-xl shadow-gray-300/50 p-8 space-y-7 border border-gray-200"
        >
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-3xl font-bold text-black">
                    API Konfigurācija
                </h2>
                <p className="text-sm text-gray-600 mt-1">Izveido savu pielāgoto API galapunktu</p>
            </div>

            <div>
                <label className="block text-sm font-semibold mb-2 text-black">
                    Galvenais Route
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={mainRoute}
                        onChange={handleRouteChange}
                        placeholder="/test"
                        className={`w-full border-2 rounded-xl p-3 pl-4 transition-all duration-200
                            ${routeError
                                ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                                : "border-gray-300 focus:border-black focus:ring-4 focus:ring-gray-200"
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

            {mainRoute && !routeError && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                                GET
                            </span>
                            <span className="font-mono text-sm text-gray-700">
                                {mainRoute}
                            </span>
                        </div>
                        <span className="text-xs text-gray-500">Galvenais</span>
                    </div>
                </motion.div>
            )}

            <div className="rounded-xl p-4 border border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                            id="private"
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-400 rounded-full peer-checked:bg-black transition-all duration-300 shadow-inner"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5 shadow-md"></div>
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-black">Privāts API</span>
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
                        <div className=" border border-gray-300 rounded-xl p-4 space-y-2">
                            <label className="block text-sm font-semibold text-black">
                                🔒 Parole
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ievadi API paroli"
                                className="w-full border-2 border-gray-300 rounded-xl px-4 py-2.5 focus:border-black focus:ring-4 focus:ring-gray-200 outline-none transition-all"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div>
                <label className="block text-sm font-semibold mb-2 text-black">
                    Datu formāts
                </label>
                <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-xl p-3 px-4 focus:border-black focus:ring-4 focus:ring-gray-200 outline-none transition-all cursor-pointer bg-white"
                >
                    <option value="json">📄 JSON</option>
                    <option value="xml">📋 XML</option>
                </select>
            </div>

            <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-base hover:bg-gray-800 transition-all shadow-lg shadow-gray-400/30 hover:shadow-xl hover:shadow-gray-400/40"
            >
                Saglabāt API
            </motion.button>
        </form>
    );
}