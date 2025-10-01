import { useEffect, useState } from "react";
import type { ImageRecognitionResponse } from "../../models/image";
import { useNavigate } from "react-router";

interface HistoryEntry {
  filename: string;
  invert: boolean;
  response: ImageRecognitionResponse;
}

function History() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const Navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("imageHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-yellow-300 rounded-4xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-center text-slate-800">
        Historial de imágenes
      </h2>
      {history.length === 0 ? (
        <p className="text-center text-slate-500">
          No hay imágenes en el historial.
        </p>
      ) : (
        history.map((entry, index) => (
          <div
            key={index}
            className="p-4 border border-slate-300 rounded-lg bg-slate-100"
          >
            <p>
              <strong>Archivo:</strong> {entry.filename}
            </p>
            <p>
              <strong>Invertida:</strong> {entry.invert ? "✅ Sí" : "❌ No"}
            </p>
            <p>
              <strong>Predicción:</strong> {entry.response.prediction}
            </p>
            <p>
              <strong>Precisión:</strong> {entry.response.accuracy}%
            </p>
            <p>
              <strong>Tiempo de procesamiento:</strong>{" "}
              {entry.response.process_time}
            </p>
          </div>
        ))
      )}
      <div className="flex justify-center mt-6 ">
        <button
          type="button"
          onClick={() => Navigate("/")}
          className="w-25 py-2 px-4 rounded-lg text-red-600 font-medium shadow- text-9xl bg-blue-600 text-center"
        >
          🔙
        </button>
      </div>
    </div>
  );
}

export { History };
