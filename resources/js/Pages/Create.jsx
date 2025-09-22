import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";

import Toast from "@/Components/Toast";
import JsonEditor from "@/Components/JsonEditor";
import Navbar from "@/Components/Navbar";
import ApiForm from "@/Components/ApiForm";

export default function Create() {
    const { auth } = usePage().props;
    const [toast, setToast] = useState(null);
    const [data, setData] = useState('{\n  "example": "value"\n}');

    return (
        <>
            <Head title="Create" />
            <div className="min-h-screen bg-gray-50 text-black">
                <Navbar auth={auth} />
                <main className="pt-24 max-w mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ApiForm onToast={setToast} data={data} setData={setData} />
                        <JsonEditor format="json" data={data} setData={setData} />
                    </div>

                    {toast && (
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast(null)}
                        />
                    )}
                </main>
            </div>
        </>
    );
}
