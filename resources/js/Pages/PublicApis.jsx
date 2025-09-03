import { Head, usePage } from "@inertiajs/react";
import { Code2, Search } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import Navbar from "@/Components/Navbar";

export default function PublicApis({ resources }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 20;

    const openApi = (route) => {
        const slug = route.startsWith("/") ? route.slice(1) : route;
        window.open(`/${slug}`, "_blank");
    };

    const filteredResources = resources.filter((res) => {
        const methods = [
            res.allow_get && "GET",
            res.allow_post && "POST",
            res.allow_put && "PUT",
            res.allow_delete && "DELETE",
        ]
            .filter(Boolean)
            .join(", ")
            .toLowerCase();

        return (
            res.route.toLowerCase().includes(search.toLowerCase()) ||
            res.format.toLowerCase().includes(search.toLowerCase()) ||
            methods.includes(search.toLowerCase())
        );
    });

    const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentResources = filteredResources.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
            <Head title="Publiski API" />
            <div className="min-h-screen bg-gray-50 text-black">
                <Navbar auth={auth} />

                <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 text-center">Publiski pieejamie API</h1>

                    <div className="flex items-center mb-8 max-w-md mx-auto bg-white rounded-xl shadow px-4 py-2">
                        <Search className="w-5 h-5 text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Meklēt pēc route, formāta vai metodes..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full outline-none bg-transparent text-gray-700"
                        />
                    </div>

                    {currentResources.length === 0 ? (
                        <p className="text-center text-gray-700">Nav atrasts neviens API.</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {currentResources.map((res) => (
                                    <div
                                        key={res.id}
                                        onClick={() => openApi(res.route)}
                                        className="bg-white rounded-2xl shadow p-6 cursor-pointer hover:shadow-lg hover:bg-gray-50 transition relative"
                                    >
                                        <h2 className="text-xl font-semibold mb-2">{res.route}</h2>
                                        <p>
                                            <strong>Formāts:</strong> {res.format.toUpperCase()} <br />
                                            <strong>Metodes:</strong>{" "}
                                            {[
                                                res.allow_get && "GET",
                                                res.allow_post && "POST",
                                                res.allow_put && "PUT",
                                                res.allow_delete && "DELETE",
                                            ]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </p>

                                        {/* Datums apakšā pa labi */}
                                        <span className="absolute bottom-3 right-3 text-gray-400 text-sm">
                                            Izveidots:{" "}
                                            {res.created_at
                                                ? new Date(res.created_at.replace(" ", "T")).toLocaleString()
                                                : "Nezināms"}
                                        </span>
                                    </div>
                                ))}
                            </div>


                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-4 mt-8">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((p) => p - 1)}
                                        className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                                    >
                                        Iepriekšējā
                                    </button>
                                    <span>
                                        Lapa {currentPage} no {totalPages}
                                    </span>
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage((p) => p + 1)}
                                        className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                                    >
                                        Nākamā
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
