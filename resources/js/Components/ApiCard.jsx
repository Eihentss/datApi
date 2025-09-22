import { Settings } from "lucide-react";

export default function ApiCard({ resource, onEdit, onOpen }) {
    const getMethods = (res) => {
        return [
            res.allow_get && "GET",
            res.allow_post && "POST",
            res.allow_put && "PUT",
            res.allow_delete && "DELETE",
        ]
            .filter(Boolean)
            .join(", ");
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Nezināms";
        return new Date(dateString.replace(" ", "T")).toLocaleString();
    };

    return (
        <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition relative">
            {/* Settings button */}
            <button
                onClick={() => onEdit(resource)}
                className="absolute top-0 right-0 mt-2 mr-2 p-2 bg-white shadow rounded-full hover:bg-gray-100 transition"
            >
                <Settings className="w-6 h-6 text-black" />
            </button>

            {/* Clickable content to open API */}
            <div
                onClick={() => onOpen(resource.route)}
                className="cursor-pointer"
            >
                <h2 className="text-xl font-semibold mb-2">
                    {resource.route}
                </h2>
                <p>
                    <strong>Status:</strong> {resource.visibility} <br />
                    <strong>Formāts:</strong> {resource.format.toUpperCase()} <br />
                    <strong>Metodes:</strong> {getMethods(resource)}
                </p>
            </div>

            <span className="absolute bottom-3 right-3 text-gray-400 text-sm">
                Izveidots: {formatDate(resource.created_at)}
            </span>
        </div>
    );
}