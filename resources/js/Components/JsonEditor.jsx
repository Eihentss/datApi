import { useState, useEffect, useRef } from "react";
import { jsonrepair } from "jsonrepair";
import Toast from "@/Components/Toast";
import axios from "axios";

export default function JsonEditor({ format, data, setData, resourceId }) {
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const fileInputRef = useRef(null);
  const stringData = typeof data === "string" ? data : JSON.stringify(data, null, 2);

  useEffect(() => {
    if (stringData) validateData(stringData, format);
  }, [stringData, format]);

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const validateData = (input, type) => {
    try {
      if (type === "json") {
        JSON.parse(input);
      } else if (type === "xml") {
        const parser = new DOMParser();
        const parsed = parser.parseFromString(input, "application/xml");
        if (parsed.getElementsByTagName("parsererror").length)
          throw new Error("XML nav derīgs");
      } else if (type === "csv") {
        const rows = input.trim().split("\n");
        const cols = rows[0].split(",");
        for (let row of rows) {
          if (row.split(",").length !== cols.length)
            throw new Error("CSV kolonnu skaits nav vienāds visās rindās");
        }
      }
      setError("");
    } catch (err) {
      setError(`${type.toUpperCase()} nav derīgs: ${err.message}`);
    }
  };

  const handleFixJson = () => {
    if (format !== "json") return;
    try {
      const repaired = JSON.stringify(JSON.parse(jsonrepair(stringData)), null, 2);
      setData(repaired);
      setError("");
      setToast({ message: "JSON ir salabots!", type: "success" });
    } catch (err) {
      setError(`JSON nav derīgs: ${err.message}`);
      setToast({ message: "Nevarēja salabot JSON!", type: "error" });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue =
        stringData.substring(0, start) + "  " + stringData.substring(end);
      setData(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  // ==== BILDES AUGŠUPIELĀDE ====
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("image", file);
  
    try {
      const { data: resp } = await axios.post(
        `/api-resources/${resourceId}/upload-image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      let parsed = {};
      try {
        parsed = JSON.parse(stringData);
      } catch {
        parsed = {};
      }
  
      if (!Array.isArray(parsed.images)) parsed.images = [];
  
      const urlParts = resp.url.split("/");
      const fileName = urlParts[urlParts.length - 1];
  
      const newUrl = resp.url.replace("/default/" + fileName, "/" + fileName);
  
      parsed.images.push(newUrl);
  
      const ordered = {
        example: parsed.example || "value",
        images: parsed.images
      };
  
      setData(JSON.stringify(ordered, null, 2));
      setToast({ message: "Bilde veiksmīgi pievienota!", type: "success" });
    } catch (err) {
      const msg = err.response?.data?.message || "Neizdevās augšupielādēt bildi!";
      setToast({ message: msg, type: "error" });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  };
  
  const lines = stringData ? stringData.split("\n") : [];
  const lineCount = lines.length;

  return (
    <div className="flex flex-col h-full space-y-4">
       <div className="flex-1 flex border rounded-lg overflow-hidden">
        <div
          ref={lineNumbersRef}
          className="bg-black text-white font-mono text-sm leading-6 px-3 py-3 min-w-[60px] select-none overflow-hidden"
          style={{ borderRight: "1px solid rgb(0,0,0)" }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="text-right pr-2" style={{ height: "24px" }}>
              {i + 1}
            </div>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          value={stringData}
          onChange={(e) => setData(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="flex-1 h-full p-3 font-mono text-sm leading-6 bg-black text-white focus:outline-none focus:ring-2 focus:ring-black resize-none overflow-y-auto"
          placeholder="Ievadiet savu datu..."
        />
      </div>

      {/* Errors */}
      {error && (
        <div>
          <p className="text-red-500 text-sm font-medium">{error}</p>
          {format === "json" && (
            <button
              type="button"
              onClick={handleFixJson}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-lg shadow transition-colors duration-200"
            >
              Mēģināt salabot JSON
            </button>
          )}
        </div>
      )}

      {format === "json" && resourceId && (
        <div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            id="upload-image-input"
          />
          <label
            htmlFor="upload-image-input"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-lg shadow cursor-pointer"
          >
            + Pievienot bildi
          </label>
        </div>
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
