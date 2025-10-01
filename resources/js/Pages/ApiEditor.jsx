import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import Toast from "@/Components/Toast";
import JsonEditor from "@/Components/JsonEditor";
import Navbar from "@/Components/Navbar";

export default function ApiEditor({ resource }) {
  const { auth } = usePage().props;
  const [data, setData] = useState(
    resource.schema ? JSON.stringify(resource.schema, null, 2) : ""
  );
  const [toast, setToast] = useState(null);

  const handleSave = async () => {
    try {
      const parsedData = resource.format === "json" ? JSON.parse(data) : data;

      await axios.put(`/api-resources/${resource.id}`, {
        ...resource,
        schema: parsedData,
      });

      setToast({ message: "API dati saglabāti!", type: "success" });
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Kļūda saglabājot API",
        type: "error",
      });
    }
  };

  const fullUrl = `${window.location.origin}${resource.route}`;

  return (
    <>
      <Head title={`Rediģēt API - ${resource.route}`} />
      <div className="h-screen flex flex-col bg-gray-50">
        <Navbar auth={auth} />
        <main className="flex-1 flex flex-col pt-20 max-w-6xl mx-auto px-4 w-full">
          <h1 className="text-2xl font-bold mb-4">{fullUrl}</h1>

          <div className="flex-1 flex flex-col bg-white rounded-2xl shadow p-6 overflow-hidden">
            <JsonEditor format={resource.format} data={data} setData={setData} resourceId={resource.id} />

            <button
              onClick={handleSave}
              className="mt-4 w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-black/90"
            >
              Saglabāt izmaiņas
            </button>
          </div>
        </main>

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </>
  );
}
