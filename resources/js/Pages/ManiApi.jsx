import { Head, usePage } from "@inertiajs/react";
import { Search, Settings } from "lucide-react";
import Navbar from "@/Components/Navbar";
import { useState } from "react";
import ApiEditorModal from "@/Components/ApiEditorModal";

export default function ManiApi() {
    const {resources: initialResources } = usePage().props;
    const [resources, setResources] = useState(initialResources || []);
    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [showEditor, setShowEditor] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null); // 👈 te glabājam izvēlēto
    const itemsPerPage = 20;
    const loading = resources === undefined;

    const openApi = (route) => {
        const slug = route.startsWith("/") ? route.slice(1) : route;
        window.open(`/${slug}`, "_blank");
    };

    const filteredResources = !loading
        ? resources.filter((res) => {
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
          })
        : [];

    const totalPages = Math.ceil(filteredResources.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentResources = filteredResources.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handleSave = (data) => {
        console.log("Saglabātie dati:", data);
    };

    return (
        <>
            <Head title="Mani API" />
            <Navbar />

            <div className="pt-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <h1 className="text-4xl font-bold mb-8 text-center">
                    Mani API
                </h1>

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

                {loading ? (
                    <p className="text-center text-gray-700">Ielādē...</p>
                ) : resources.length === 0 ? (
                    <p className="text-center text-gray-700">
                        Nav neviena API.
                    </p>
                ) : filteredResources.length === 0 ? (
                    <p className="text-center text-gray-700">
                        Nekas netika atrasts.
                    </p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {currentResources.map((res) => (
                                <div
                                    key={res.id}
                                    className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition relative"
                                >
                                    {/* Zobrata poga */}
                                    <button
                                        onClick={() => {
                                            setSelectedResource(res); // 👈 saglabājam resursu
                                            setShowEditor(true);
                                        }}
                                        className="absolute top-0 right-0 mt-2 mr-2 p-2 bg-white shadow rounded-full hover:bg-gray-100 transition"
                                    >
                                        <Settings className="w-6 h-6 text-black" />
                                    </button>

                                    {/* Klikšķis atver API */}
                                    <div
                                        onClick={() => openApi(res.route)}
                                        className="cursor-pointer"
                                    >
                                        <h2 className="text-xl font-semibold mb-2">
                                            {res.route}
                                        </h2>
                                        <p>
                                            <strong>Status:</strong>{" "}
                                            {res.visibility} <br />
                                            <strong>Formāts:</strong>{" "}
                                            {res.format.toUpperCase()} <br />
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
                                    </div>

                                    <span className="absolute bottom-3 right-3 text-gray-400 text-sm">
                                        Izveidots:{" "}
                                        {res.created_at
                                            ? new Date(
                                                  res.created_at.replace(
                                                      " ",
                                                      "T"
                                                  )
                                              ).toLocaleString()
                                            : "Nezināms"}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-8">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                        setCurrentPage((p) => p - 1)
                                    }
                                    className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                                >
                                    Iepriekšējā
                                </button>
                                <span>
                                    Lapa {currentPage} no {totalPages}
                                </span>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() =>
                                        setCurrentPage((p) => p + 1)
                                    }
                                    className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                                >
                                    Nākamā
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Editor modālis */}
            {showEditor && selectedResource && (
                <ApiEditorModal
    show={showEditor}
    onClose={() => setShowEditor(false)}
    initialData={selectedResource}
    onSave={(updatedResource) => {
        setResources((prev) => {
            if (!updatedResource) return prev;

            if (updatedResource.id) {
                // update
                return prev.map((r) =>
                    r.id === updatedResource.id ? updatedResource : r
                );
            }
            // add
            return [...prev, updatedResource];
        });
    }}
/>


            )}
        </>
    );
}
