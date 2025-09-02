import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Code2 } from "lucide-react";
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
                

                <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                <label className="block text-sm font-medium mb-1">
                                    Atļautās metodes
                                </label>
                                <div className="flex gap-4 flex-wrap">
                                    {["GET", "POST", "PUT", "DELETE"].map(
                                        (method) => (
                                            <label
                                                key={method}
                                                className="flex items-center gap-2"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={methods.includes(
                                                        method
                                                    )}
                                                    onChange={() =>
                                                        handleMethodChange(
                                                            method
                                                        )
                                                    }
                                                />
                                                {method}
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
