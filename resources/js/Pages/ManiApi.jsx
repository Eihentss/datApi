import { Head, usePage } from "@inertiajs/react";
import { useState, useMemo, useEffect } from "react";

import Navbar from "@/Components/Navbar";
import ApiEditorModal from "@/Components/ApiEditorModal";
import ApiSearch from "@/Components/ApiSearch";
import ApiCard from "@/Components/ApiCard";
import Pagination from "@/Components/Pagination";

export default function ManiApi() {
    // Iegūst props no servera
    const { sharedResources: initialSharedResources } = usePage().props;

    // Izmanto tikai tos API, kas nāk no pivot tabulas
    const [resources, setResources] = useState(initialSharedResources || []);

    const [showEditor, setShowEditor] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 20;
    
    const filteredResources = useMemo(() => {
        if (!resources || resources.length === 0) return [];

        return resources.filter((res) => {

            const searchTerm = search.toLowerCase();
            return (
                res.route.toLowerCase().includes(searchTerm) ||
                res.format.toLowerCase().includes(searchTerm) ||
                methods.includes(searchTerm)
            );
        });
    }, [resources, search]);

    const totalPages = Math.ceil(filteredResources.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentResources = filteredResources.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handleSearchChange = (newSearch) => {
        setSearch(newSearch);
        setCurrentPage(1);
    };

    const handleDelete = (deletedId) => {
        setResources((prev) => prev.filter((r) => r.id !== deletedId));
    };

    const handleUpdate = (updatedResource) => {
        setResources((prev) => {
            if (!updatedResource) return prev;
            if (updatedResource.id) {
                return prev.map((r) =>
                    r.id === updatedResource.id ? updatedResource : r
                );
            }
            return [...prev, updatedResource];
        });
    };

    const loading = resources === undefined;

    const openApi = (route) => {
        const slug = route.startsWith("/") ? route.slice(1) : route;
        window.open(`/${slug}`, "_blank");
    };

    const handleEdit = (resource) => {
        setSelectedResource(resource);
        setShowEditor(true);
    };

    useEffect(() => {
        if (resources && resources.length > 0) {
            resources.forEach((res) => {
                console.log("Galvenais route:", res.route);
                if (res.sub_routes && res.sub_routes.length > 0) {
                    res.sub_routes.forEach((sub) => {
                        console.log(` - Sub_path: ${sub.sub_path}, Method: ${sub.method}`);
                    });
                } else {
                    console.log(" - Nav sub-routes");
                }
            });
        }
    }, [resources]);
    

    const handleCloseEditor = () => {
        setShowEditor(false);
        setSelectedResource(null);
    };

    return (
        <>
            <Head title="Mani API" />
            <div className="min-h-screen bg-gray-50 text-black">
                <Navbar />

                <div className="pt-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <h1 className="text-4xl font-bold mb-8 text-center">
                        Mani API
                    </h1>

                    <ApiSearch
                        search={search}
                        onSearchChange={handleSearchChange}
                        onPageReset={() => setCurrentPage(1)}
                    />

                    {loading ? (
                        <p className="text-center text-gray-700">Ielādē...</p>
                    ) : resources.length === 0 ? (
                        <p className="text-center text-gray-700">
                            Nav neviena API.
                        </p>
                    ) : currentResources.length === 0 ? (
                        <p className="text-center text-gray-700">
                            Nekas netika atrasts.
                        </p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {currentResources.map((resource) => (
                                    <ApiCard
                                        key={resource.id}
                                        resource={resource}
                                        onEdit={handleEdit}
                                        onOpen={openApi}
                                    />
                                ))}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </div>

                {showEditor && selectedResource && (
                    <ApiEditorModal
                        show={showEditor}
                        onClose={handleCloseEditor}
                        initialData={selectedResource}
                        onDelete={handleDelete}
                        onSave={handleUpdate}
                    />
                )}
            </div>
        </>
    );
}
