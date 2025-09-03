import { Head, usePage } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";

export default function ManiApi() {
    const { resources } = usePage().props;

    // Loading ir true tikai tad, ja resources nav vēl padoti
    const loading = resources === undefined;
    const openApi = (route) => {
        const slug = route.startsWith("/") ? route.slice(1) : route;
        window.open(`/${slug}`, "_blank");
    };
    return (
        <>
            <Head title="Mani API" />
            <Navbar />

            <div className="pt-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold mb-8 text-center">
                    Mani API
                </h1>

                {loading ? (
                    <p className="text-center text-gray-700">Ielādē...</p>
                ) : resources.length === 0 ? (
                    <p className="text-center text-gray-700">
                        Nav neviena API.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {resources.map((res) => (
                            <div
                                key={res.id}
                                onClick={() => openApi(res.route)}
                                className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition cursor-pointer relative"
                            >
                                <h2 className="text-xl font-semibold mb-2">
                                    {res.route}
                                </h2>
                                <p>
                                    <strong>Status:</strong> {res.visibility}{" "}
                                    <br />
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

<span className="absolute bottom-3 right-3 text-gray-400 text-sm">
    Izveidots: {res.created_at ? new Date(res.created_at.replace(" ", "T")).toLocaleString() : "Nezināms"}
</span>



                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
