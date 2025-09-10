import { useState, useEffect } from "react";

export default function ApiEditorModal({ show, onClose, onSave, onDelete, initialData }) {
    const [formData, setFormData] = useState({
        route: "",
        format: "json",
        visibility: "public",
        schema: "",
        allow_get: false,
        allow_post: false,
        allow_put: false,
        allow_delete: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (show) {
            setError("");
            setSuccess("");
            if (initialData) {
                setFormData({
                    route: initialData.route || "",
                    format: initialData.format || "json",
                    visibility: initialData.visibility || "public",
                    schema: initialData.schema || "",
                    allow_get: initialData.allow_get || false,
                    allow_post: initialData.allow_post || false,
                    allow_put: initialData.allow_put || false,
                    allow_delete: initialData.allow_delete || false,
                });
            } else {
                // Reset form for new resource
                setFormData({
                    route: "",
                    format: "json",
                    visibility: "public",
                    schema: "",
                    allow_get: false,
                    allow_post: false,
                    allow_put: false,
                    allow_delete: false,
                });
            }
        }
    }, [initialData, show]);

    if (!show) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        // Clear errors when user starts typing
        if (error) setError("");
    };

    const handleSubmit = async () => {
        if (loading) return;
        
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const url = initialData?.id
                ? `/api-resources/${initialData.id}`
                : "/api-resources";
        
            const method = initialData?.id ? "PUT" : "POST";
    
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                },
                body: JSON.stringify(formData),
            });
    
            let data;
            try {
                data = await response.json();
            } catch {
                throw new Error("Serveris neatgrieza JSON atbildi");
            }
    
            if (!response.ok) {
                setError(data.message || "Kļūda saglabājot API");
                return;
            }

            setSuccess(data.message || "API veiksmīgi saglabāts!");
    
            if (data.resource) {
                onSave(data.resource);
            }

            // Close modal after short delay to show success message
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err) {
            console.error("Saglabāšanas kļūda:", err);
            setError("Neizdevās saglabāt API. Lūdzu mēģiniet vēlreiz.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!initialData?.id || loading) return;
        
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(`/api-resources/${initialData.id}`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                },
            });

            let data;
            try {
                data = await response.json();
            } catch {
                // If no JSON response, check if request was successful
                if (response.ok) {
                    data = { message: "API veiksmīgi dzēsts!" };
                } else {
                    throw new Error("Serveris neatgrieza JSON atbildi");
                }
            }

            if (!response.ok) {
                setError(data.message || "Kļūda dzēšot API");
                return;
            }

            setSuccess(data.message || "API veiksmīgi dzēsts!");

            if (onDelete) {
                onDelete(initialData.id);
            }

            // Close modal after short delay to show success message
            setTimeout(() => {
                setShowDeleteConfirm(false);
                onClose();
            }, 1000);
        } catch (err) {
            console.error("Dzēšanas kļūda:", err);
            setError("Neizdevās dzēst API. Lūdzu mēģiniet vēlreiz.");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = () => {
        setShowDeleteConfirm(true);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
                    {initialData?.id ? "Editēt API" : "Izveidot API"}
                </h2>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    Šeit vari pievienot vai labot API datus.
                </p>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-sm">{success}</p>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Route */}
                    <input
                        type="text"
                        name="route"
                        value={formData.route}
                        onChange={handleChange}
                        placeholder="Route (piemēram: /mani-dati)"
                        className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        disabled={loading}
                    />

                    {/* Format select */}
                    <select
                        name="format"
                        value={formData.format}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        disabled={loading}
                    >
                        <option value="json">JSON</option>
                        <option value="xml">XML</option>
                        <option value="yaml">YAML</option>
                    </select>

                    {/* Visibility select */}
                    <select
                        name="visibility"
                        value={formData.visibility}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        disabled={loading}
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>

                    {/* HTTP Methods */}
                    <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-2 text-sm sm:text-base">
                            <input
                                type="checkbox"
                                name="allow_get"
                                checked={formData.allow_get}
                                onChange={handleChange}
                                disabled={loading}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            GET
                        </label>
                        <label className="flex items-center gap-2 text-sm sm:text-base">
                            <input
                                type="checkbox"
                                name="allow_post"
                                checked={formData.allow_post}
                                onChange={handleChange}
                                disabled={loading}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            POST
                        </label>
                        <label className="flex items-center gap-2 text-sm sm:text-base">
                            <input
                                type="checkbox"
                                name="allow_put"
                                checked={formData.allow_put}
                                onChange={handleChange}
                                disabled={loading}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            PUT
                        </label>
                        <label className="flex items-center gap-2 text-sm sm:text-base">
                            <input
                                type="checkbox"
                                name="allow_delete"
                                checked={formData.allow_delete}
                                onChange={handleChange}
                                disabled={loading}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            DELETE
                        </label>
                    </div>

                    {/* Editor un Statistika pogas */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm sm:text-base font-medium text-blue-700 disabled:opacity-50"
                            onClick={() => {
                                if (initialData?.id) {
                                    window.open(`/api-editor/${initialData.id}`, '_blank');
                                }
                            }}
                            disabled={loading || !initialData?.id}
                        >
                            Editor
                        </button>
                        <button
                            className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-sm sm:text-base font-medium text-green-700 disabled:opacity-50"
                            onClick={() => {
                                if (initialData?.id) {
                                    window.open(`/api-statistics/${initialData.id}`, '_blank');
                                }
                            }}
                            disabled={loading || !initialData?.id}
                        >
                            Statistika
                        </button>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                        <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                            <h3 className="text-lg font-semibold mb-2">Apstiprināt dzēšanu</h3>
                            <p className="text-gray-600 mb-4">
                                Vai tiešām vēlies dzēst šo API? Šo darbību nevar atsaukt.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                                    disabled={loading}
                                >
                                    Atcelt
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? "Dzēš..." : "Dzēst"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
                    {/* Delete button on the left */}
                    <div className="w-full sm:w-auto order-3 sm:order-1">
                        {initialData?.id && (
                            <button
                                onClick={confirmDelete}
                                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm sm:text-base font-medium shadow-sm disabled:opacity-50"
                                disabled={loading}
                            >
                                Dzēst
                            </button>
                        )}
                    </div>
                    
                    {/* Cancel and Save buttons on the right */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-1 sm:order-2">
                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm sm:text-base disabled:opacity-50"
                            disabled={loading}
                        >
                            Aizvērt
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base font-medium shadow-sm disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Saglabā..." : "Saglabāt"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}