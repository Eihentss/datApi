import { useState, useEffect, useRef } from "react";
import { jsonrepair } from "jsonrepair";
import Toast from "@/Components/Toast";




export default function DataEditor({ format, data, setData }) {
  const [error, setError] = useState("");
  
  const [toast, setToast] = useState(null);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  useEffect(() => {
    validateData(data, format);
  }, [data, format]);

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
        if (parsed.getElementsByTagName("parsererror").length) {
          throw new Error("XML nav derīgs");
        }
      } else if (type === "csv") {
        const rows = input.trim().split("\n");
        const cols = rows[0].split(",");
        for (let row of rows) {
          if (row.split(",").length !== cols.length) {
            throw new Error("CSV kolonnu skaits nav vienāds visās rindās");
          }
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
      let repairedData = data.trim();
      
      let attempts = [
        () => {
          const repaired = jsonrepair(repairedData);
          return JSON.stringify(JSON.parse(repaired), null, 2);
        },
        
        () => {
          const objects = repairedData
            .split(/}\s*{/)
            .map((part, index, array) => {
              if (index === 0 && array.length > 1) return part + '}';
              if (index === array.length - 1 && array.length > 1) return '{' + part;
              if (array.length > 1) return '{' + part + '}';
              return part;
            })
            .filter(part => part.trim());

          if (objects.length > 1) {
            const parsedObjects = objects.map(obj => {
              const cleaned = obj.trim();
              try {
                return JSON.parse(jsonrepair(cleaned));
              } catch {
                return JSON.parse(cleaned);
              }
            });
            
            return JSON.stringify(parsedObjects, null, 2);
          }
          throw new Error("Nav vairāki objekti");
        },
        
        () => {
          const withCommas = repairedData.replace(/}\s*{/g, '},{');
          const arrayFormat = '[' + withCommas + ']';
          const repaired = jsonrepair(arrayFormat);
          return JSON.stringify(JSON.parse(repaired), null, 2);
        },
        
        () => {
          const cleaned = repairedData
            .replace(/}\s*{/g, '},{')
            .replace(/^\s*/, '[')
            .replace(/\s*$/, ']');
          
          const repaired = jsonrepair(cleaned);
          return JSON.stringify(JSON.parse(repaired), null, 2);
        }
      ];
      
      let lastError;
      for (let attempt of attempts) {
        try {
          const result = attempt();
          setData(result);
          setError("");
          setToast({ message: "JSON ir salabots!", type: "success" });
          return;
        } catch (err) {
          lastError = err;
          continue;
        }
      }
      
      throw lastError || new Error("Nevarēja salabot JSON");
      
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

      const newValue = data.substring(0, start) + "  " + data.substring(end);
      setData(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const lines = data.split("\n");
  const lineCount = lines.length;

  return (
    <div className="bg-white rounded-2xl shadow p-8 space-y-6">
      <div className="border rounded-lg overflow-hidden h-[600px] relative">
        <div className="flex h-full">
          <div 
            ref={lineNumbersRef}
            className="bg-gray-900 text-white font-mono text-sm leading-6 px-3 py-3 min-w-[60px] select-none overflow-hidden"
            style={{ 
              borderRight: '1px solid #374151',
              height: '600px'
            }}
          >
            <div className="pointer-events-none">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i} className="text-right pr-2" style={{ height: '24px' }}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          
          <textarea
            ref={textareaRef}
            value={data}
            onChange={(e) => setData(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            className="flex-1 h-full resize-none p-3 font-mono text-sm leading-6 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto"
            style={{ height: "600px" }}
            placeholder="Ievadiet savu datu..."
          />
        </div>
      </div>

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