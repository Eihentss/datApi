import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function ApiForm({ onToast, data, setData }) {
    const [mainRoute, setMainRoute] = useState("");
    const [routeError, setRouteError] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [format, setFormat] = useState("json");
    const [password, setPassword] = useState("");
    
    const [additionalRoutes, setAdditionalRoutes] = useState([]);

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

    const handleSubRouteChange = (id, value) => {
        if (value.startsWith("/")) {
            value = value.substring(1);
        }
        setAdditionalRoutes(
            additionalRoutes.map(route =>
                route.id === id ? { ...route, subPath: value } : route
            )
        );
    };

    const addAdditionalRoute = () => {
        if (additionalRoutes.length < 4) {
            setAdditionalRoutes([
                ...additionalRoutes,
                { id: Date.now(), method: "GET", subPath: "" }
            ]);
        }
    };

    const removeAdditionalRoute = (id) => {
        setAdditionalRoutes(additionalRoutes.filter(route => route.id !== id));
    };

    const updateRouteMethod = (id, method) => {
        setAdditionalRoutes(
            additionalRoutes.map(route =>
                route.id === id ? { ...route, method } : route
            )
        );
    };

    const resetForm = () => {
        setMainRoute("");
        setIsPrivate(false);
        setPassword("");
        setFormat("json");
        setAdditionalRoutes([]);
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
    
        // Pārbaudam papildus route ievades
        for (let route of additionalRoutes) {
            if (!route.subPath || route.subPath.trim() === "") {
                onToast({ message: "Visi papildus route ceļi jābūt aizpildītiem!", type: "error" });
                return;
            }
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
            sub_routes: [
                {
                  sub_path: mainRoute.replace(/^\//, ""), // noņem sākuma /
                  method: "GET",
                  is_main: true,
                },
                ...additionalRoutes.map((r) => ({
                  sub_path: r.subPath,
                  method: r.method,
                  is_main: false,
                })),
            ],
        };
    
        try {
            await axios.post("/api-resources", payload);
    
            onToast({
                message: `API saglabāts ar ${payload.sub_routes.length} route!`,
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

            {/* Papildus routes */}
            <AnimatePresence>
                {additionalRoutes.map((route, index) => (
                    <motion.div
                        key={route.id}
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs text-gray-500 font-semibold">
                                Route #{index + 2}
                            </span>
                            <button
                                type="button"
                                onClick={() => removeAdditionalRoute(route.id)}
                                className="ml-auto text-red-500 hover:text-red-700 text-sm font-bold transition-colors"
                            >
                                ✕ Dzēst
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold mb-2 text-gray-700">
                                    Route ceļš
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500 font-mono text-sm">{mainRoute}/</span>
                                    <input
                                        type="text"
                                        value={route.subPath}
                                        onChange={(e) => handleSubRouteChange(route.id, e.target.value)}
                                        placeholder="lietotaji"
                                        className="flex-1 border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-black focus:ring-2 focus:ring-gray-200 outline-none transition-all font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold mb-2 text-gray-700">
                                    Metode
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {["GET", "POST", "PUT", "DELETE"].map((method) => (
                                        <label key={method} className="relative cursor-pointer">
                                            <input
                                                type="radio"
                                                name={`method-${route.id}`}
                                                checked={route.method === method}
                                                onChange={() => updateRouteMethod(route.id, method)}
                                                className="sr-only peer"
                                            />
                                            <div
                                                className={`flex items-center justify-center
                                                    h-10 px-2 rounded-lg border-2 
                                                    font-bold text-xs
                                                    transition-all duration-200
                                                    ${route.method === method
                                                        ? "bg-black border-black text-white"
                                                        : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                                                    }`}
                                            >
                                                {method}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            {mainRoute && !routeError && route.subPath && (
                                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                                    <span className="text-xs text-gray-500">Preview:</span>
                                    <span className="font-mono text-xs text-gray-700 font-semibold">
                                        {mainRoute}/{route.subPath}
                                    </span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Pievienot papildus route pogu */}
            {additionalRoutes.length < 4 && mainRoute && !routeError && (
                <motion.button
                    type="button"
                    onClick={addAdditionalRoute}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-gray-600 hover:border-black hover:text-black hover:bg-gray-50 transition-all font-semibold text-sm flex items-center justify-center gap-2"
                >
                    <span className="text-xl">+</span>
                    Pievienot Route ({additionalRoutes.length}/4)
                </motion.button>
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