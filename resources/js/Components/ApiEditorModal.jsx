import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";

export default function ApiEditorModal({ show, onClose, onSave, onDelete, initialData }) {
    const { auth } = usePage().props; // <- ja inertia padod user datus

    const [formData, setFormData] = useState({
        route: "",
        format: "json",
        visibility: "public",
        schema: "",
        allow_get: false,
        allow_post: false,
        allow_put: false,
        allow_delete: false,
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [userRole, setUserRole] = useState("admin");
    const [apiUsers, setApiUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const currentUserId = auth?.user?.id;

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
                    allow_get: !!initialData.allow_get,
                    allow_post: !!initialData.allow_post,
                    allow_put: !!initialData.allow_put,
                    allow_delete: !!initialData.allow_delete,
                    password: "",
                });
                loadApiUsers();
            } else {
                setFormData({
                    route: "",
                    format: "json",
                    visibility: "public",
                    schema: "",
                    allow_get: false,
                    allow_post: false,
                    allow_put: false,
                    allow_delete: false,
                    password: "",
                });
                setApiUsers([]);
            }
        }
    }, [initialData, show]);

    const loadApiUsers = async () => {
        if (!initialData?.id) return;

        setLoadingUsers(true);
        try {
            const response = await fetch(`/api-resources/${initialData.id}/users`, {
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                },
            });

            if (response.ok) {
                const data = await response.json();
                setApiUsers(data.users || []);
            }
        } catch (err) {
            console.error("Kļūda ielādējot lietotājus:", err);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleAddUser = async () => {
        if (!userEmail.trim() || !initialData?.id) return;

        setLoading(true);
        try {
            const response = await fetch(`/api-resources/${initialData.id}/add-user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                },
                body: JSON.stringify({
                    email: userEmail.trim(),
                    role: userRole,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Kļūda pievienojot lietotāju");
                return;
            }

            setSuccess(data.message || "Lietotājs veiksmīgi pievienots!");
            setUserEmail("");
            setUserRole("admin");
            setShowUserModal(false);
            loadApiUsers();

        } catch (err) {
            console.error("Kļūda pievienojot lietotāju:", err);
            setError("Neizdevās pievienot lietotāju. Lūdzu mēģiniet vēlreiz.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveUser = async (userId) => {
        if (!initialData?.id) return;

        setLoading(true);
        try {
            const response = await fetch(`/api-resources/${initialData.id}/remove-user/${userId}`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Kļūda noņemot lietotāju");
                return;
            }

            setSuccess(data.message || "Lietotājs veiksmīgi noņemts!");
            loadApiUsers();

        } catch (err) {
            console.error("Kļūda noņemot lietotāju:", err);
            setError("Neizdevās noņemt lietotāju. Lūdzu mēģiniet vēlreiz.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUserRole = async (userId, newRole) => {
        if (!initialData?.id) return;

        setLoading(true);
        try {
            const response = await fetch(`/api-resources/${initialData.id}/update-user-role/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                },
                body: JSON.stringify({ role: newRole }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Kļūda mainot lomu");
                return;
            }

            setSuccess(data.message || "Loma veiksmīgi atjaunota!");
            loadApiUsers();

        } catch (err) {
            console.error("Kļūda mainot lomu:", err);
            setError("Neizdevās mainīt lomu. Lūdzu mēģiniet vēlreiz.");
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (error) setError("");
    }

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

            const payload = { ...formData };
            if (formData.password === "") {
                delete payload.password;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                },
                body: JSON.stringify(payload),
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

            if (onDelete) onDelete(initialData.id);

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

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-sm">{success}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <input
                        type="text"
                        name="route"
                        value={formData.route}
                        onChange={handleChange}
                        placeholder="Route (piemēram: /mani-dati)"
                        className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        disabled={loading}
                    />

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

                    {formData.visibility === "private" && (
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={initialData?.id ? "******** (atstāj tukšu, ja nemainīt)" : "Ievadi paroli šim API"}
                            className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            disabled={loading}
                        />
                    )}

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

                    {initialData?.id && (
    <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Lietotāju pārvaldība</h3>

            {/* Pievieno tikai ja esi owner */}
            {initialData.user_id === currentUserId && (
                <button
                    onClick={() => setShowUserModal(true)}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                    disabled={loading}
                >
                    + Pievienot lietotāju
                </button>
            )}
        </div>

                            {loadingUsers ? (
                                <p className="text-gray-500 text-sm">Ielādē lietotājus...</p>
                            ) : apiUsers.length > 0 ? (
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {apiUsers.length > 0 ? (
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {apiUsers.map((user) => {
                                                // Nosaka, vai pašreizējais lietotājs ir owner
                                                const isOwner = initialData.user_id === currentUserId; // currentUserId jānodod kā props vai no Page props
                                                // Nosaka, vai rādīt pārvaldības opcijas šim lietotājam
                                                const canManage = isOwner && user.id !== initialData.user_id;

                                                // Nosaka role: pivot.role ja shared, owner ja īpašnieks
                                                const roleLabel = user.id === initialData.user_id
                                                    ? 'owner'
                                                    : user.pivot?.role || 'unknown';

                                                return (
                                                    <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">{user.name}</p>
                                                            <p className="text-xs text-gray-500">{user.email}</p>
                                                            <p className="text-xs text-gray-400">Role: {roleLabel}</p>
                                                        </div>

                                                        {canManage && (
                                                            <div className="flex items-center gap-2">
                                                                <select
                                                                    value={user.pivot?.role || 'admin'}
                                                                    onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                                                                    className="text-xs border rounded px-2 py-1"
                                                                    disabled={loading}
                                                                >
                                                                    <option value="admin">Admin</option>
                                                                    <option value="co-owner">Co-owner</option>
                                                                </select>
                                                                <button
                                                                    onClick={() => handleRemoveUser(user.id)}
                                                                    className="text-red-600 hover:text-red-700 text-xs"
                                                                    disabled={loading}
                                                                >
                                                                    Noņemt
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">Nav pievienotu lietotāju</p>
                                    )}



                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">Nav pievienotu lietotāju</p>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm sm:text-base font-medium text-blue-700 disabled:opacity-50"
                            onClick={() => {
                                if (initialData?.id) {
                                    window.location.href = `/api-editor/${initialData.id}`;
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
                                    window.location.href = `/api-statistics/${initialData.id}`;
                                }
                            }}
                            disabled={loading || !initialData?.id}
                        >
                            Statistika
                        </button>
                    </div>
                </div>

                {showUserModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                        <div className="bg-white rounded-lg p-6 max-w-sm mx-4 w-full">
                            <h3 className="text-lg font-semibold mb-4">Pievienot lietotāju</h3>

                            <div className="space-y-3">
                                <input
                                    type="email"
                                    placeholder="Lietotāja e-pasts"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    disabled={loading}
                                />

                                <select
                                    value={userRole}
                                    onChange={(e) => setUserRole(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    disabled={loading}
                                >
                                    <option value="admin">Admin (var rediģēt tikai datu struktūru)</option>
                                    <option value="co-owner">Co-owner (pilnas tiesības, izņemot lietotāju pārvaldību)</option>
                                </select>
                            </div>

                            <div className="flex gap-3 justify-end mt-4">
                                <button
                                    onClick={() => {
                                        setShowUserModal(false);
                                        setUserEmail("");
                                        setUserRole("admin");
                                    }}
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                                    disabled={loading}
                                >
                                    Atcelt
                                </button>
                                <button
                                    onClick={handleAddUser}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                                    disabled={loading || !userEmail.trim()}
                                >
                                    {loading ? "Pievieno..." : "Pievienot"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
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