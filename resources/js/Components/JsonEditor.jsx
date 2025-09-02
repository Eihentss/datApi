import { useState, useEffect } from "react";
import { jsonrepair } from "jsonrepair";
import Toast from "@/Components/Toast";

export default function DataEditor({ format, data, setData }) {
    const [error, setError] = useState("");
    const [toast, setToast] = useState(null);

    useEffect(() => {
        validateData(data, format);
    }, [data, format]);

    const validateData = (input, type) => {
        try {
            if (type === "json") {
                JSON.parse(input);
            } else if (type === "xml") {
                const parser = new DOMParser();
                const parsed = parser.parseFromString(input, "application/xml");
                if (parsed.getElementsByTagName("parsererror").length) {
                    throw new Error("XML nav derīgs");
                }
            } else if (type === "csv") {
                const rows = input.trim().split("\n");
                const cols = rows[0].split(",");
                for (let row of rows) {
                    if (row.split(",").length !== cols.length) {
                        throw new Error("CSV kolonnu skaits nav vienāds visās rindās");
                    }
                }
            }
            setError("");
        } catch (err) {
            setError(`${type.toUpperCase()} nav derīgs: ${err.message}`);
        }
    };

    const handleFixJson = () => {
        if (format !== "json") return;
        try {
            const repaired = jsonrepair(data);
            const pretty = JSON.stringify(JSON.parse(repaired), null, 2);
            setData(pretty);
            setError("");
        } catch (err) {
            setError(`JSON nav derīgs: ${err.message}`);
            setToast({ message: "JSON nav derīgs!", type: "error" });
        }
    };

    const lines = data.split("\n");

    const handleKeyDown = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            const newValue =
                data.substring(0, start) + "    " + data.substring(end);

            setData(newValue);

            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 4;
            }, 0);
        }
    };

    return (
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">
                API Dati ({format.toUpperCase()})
            </h2>

            <div className="relative flex font-mono text-sm rounded-lg overflow-hidden border">
                <div className="bg-gray-800 text-gray-400 py-2 px-3 text-right select-none">
                    {lines.map((_, i) => (
                        <div key={i}>{i + 1}</div>
                    ))}
                </div>

                <textarea
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`w-full h-[400px] resize-none p-3 focus:ring outline-none ${error
                            ? "bg-red-900 text-red-200 border-l border-red-500 focus:ring-red-400"
                            : "bg-black text-green-400 border-l border-gray-700 focus:ring-blue-400"
                        }`}
                    style={{ lineHeight: "1.5", fontFamily: "monospace" }}
                ></textarea>
            </div>

            {error && (
                <div className="mt-2">
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                    {format === "json" && (
                        <button
                            type="button"
                            onClick={handleFixJson}
                            className="mt-2 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-lg transition"
                        >
                            Mēģināt salabot JSON
                        </button>
                    )}
                </div>
            )}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
