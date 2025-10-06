import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function ApiSearch({ search, onSearchChange, onPageReset }) {
    const [query, setQuery] = useState(search);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onSearchChange(query);
            onPageReset();
        }, 300);
        return () => clearTimeout(timeout);
    }, [query]);

    const clearSearch = () => {
        setQuery("");
        onSearchChange("");
        onPageReset();
    };

    return (
        <div className="flex items-center mb-8 max-w-md mx-auto bg-white rounded-xl shadow px-4 py-2 border border-gray-300 transition">
            <Search className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
            <input
                type="text"
                placeholder="Meklēt pēc route, formāta vai metodes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400 border-none focus:outline-none focus:ring-0"
            />
            {query && (
                <button
                    type="button"
                    onClick={clearSearch}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}