import { useState, useEffect } from "react";

export default function ApiEditorModal({ show, onClose, onSave, initialData }) {
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

    useEffect(() => {
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
        }
    }, [initialData, show]);

    if (!show) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async () => {
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
                alert(data.message || "Kļūda saglabājot API");
                return;
            }
    
            if (data.resource) {
                onSave(data.resource); // 🔥 tagad būs pilns resurss
            }
    
            onClose();
        } catch (err) {
            console.error("Saglabāšanas kļūda:", err);
            alert("Neizdevās saglabāt API");
        }
    };
    
    
    

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
                    Editēt API
                </h2>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    Šeit vari pievienot vai labot API datus.
                </p>

                <div className="space-y-4">
                    {/* Route */}
                    <input
                        type="text"
                        name="route"
                        value={formData.route}
                        onChange={handleChange}
                        placeholder="Route"
                        className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
                    />

                    {/* Visibility select */}
                    <select
                        name="visibility"
                        value={formData.visibility}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>

                    {/* Metodes */}
                    <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-2 text-sm sm:text-base">
                            <input
                                type="checkbox"
                                name="allow_get"
                                checked={formData.allow_get}
                                onChange={handleChange}
                            />
                            GET
                        </label>
                        <label className="flex items-center gap-2 text-sm sm:text-base">
                            <input
                                type="checkbox"
                                name="allow_post"
                                checked={formData.allow_post}
                                onChange={handleChange}
                            />
                            POST
                        </label>
                        <label className="flex items-center gap-2 text-sm sm:text-base">
                            <input
                                type="checkbox"
                                name="allow_put"
                                checked={formData.allow_put}
                                onChange={handleChange}
                            />
                            PUT
                        </label>
                        <label className="flex items-center gap-2 text-sm sm:text-base">
                            <input
                                type="checkbox"
                                name="allow_delete"
                                checked={formData.allow_delete}
                                onChange={handleChange}
                            />
                            DELETE
                        </label>
                    </div>
                </div>

                {/* Papildu iestatījumi */}
                <div className="mt-6">
                    <button
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-sm sm:text-base"
                        onClick={() => alert("Papildu iestatījumi vēl nav pieejami")}
                    >
                        Papildu iestatījumi
                    </button>
                </div>

                {/* Pogas */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm sm:text-base"
                    >
                        Aizvērt
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                    >
                        Saglabāt
                    </button>
                </div>
            </div>
        </div>
    );
}
