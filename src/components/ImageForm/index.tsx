import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router";
import type { ImageRecognitionResponse } from "../../models/image";
import Swal from "sweetalert2";

function ImageForm() {
  const [invert, setInvert] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [ImageResponse, setImageResponde] =
    useState<ImageRecognitionResponse | null>(null);

  const Navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files?.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const objectURL = URL.createObjectURL(selectedFile);
      setPreview(objectURL);
    }
  };

  const saveToHistory = (entry: {
    filename: string;
    invert: boolean;
    response: ImageRecognitionResponse;
  }) => {
    const history = localStorage.getItem("imageHistory");
    const parsedHistory = history ? JSON.parse(history) : [];
    parsedHistory.push(entry);
    localStorage.setItem("imageHistory", JSON.stringify(parsedHistory));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!file) {
      Swal.fire({
        title: "¡Error!",
        text: "Debes subir una imagen para el reconocimiento",
        icon: "error",
        confirmButtonText: "De acuerdo",
      });
      setLoading(false);
      return;
    }
    Swal.fire({
      title: "Confirmar operación",
      text: "¿Deseas reconocer esta imagen?",
      icon: "question",
      confirmButtonText: "Si",
      cancelButtonText: "No",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("invert", `${invert}`);
        formData.append("image", file!);

        try {
          setLoading(true);
          const response = await fetch(
            "http://ec2-54-81-142-28.compute-1.amazonaws.com:8080/predict",
            {
              method: "POST",
              body: formData,
            }
          );
          if (!response.ok) {
            Swal.fire({
              title: "¡Error!",
              text: `Error: ${response.statusText}`,
              icon: "error",
              confirmButtonText: "De acuerdo",
            });
            return;
          }
          const data =
            (await response.json()) as unknown as ImageRecognitionResponse;
          setImageResponde(data);

          saveToHistory({
            filename: file.name,
            invert,
            response: data,
          });
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
      setLoading(false);
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-max mx-auto mt-10 p-6 bg-yellow-300 rounded-4xl shadow-lg space-y-6 "
      >
        <h2 className="text-2xl font-bold text-center text-slate-800">
          Subir imagen para reconocimiento
        </h2>
        <h4 className="text-1xl font-bold text-shadow-amber-800 text-center bg-orange-300 rounded-4xl text-slate-500">
          Grupo # 2
        </h4>
        <div>
          <label htmlFor="invert" className="form-label">
            Invertir imagen
          </label>
          <input
            type="checkbox"
            name="invert"
            id="invert"
            onChange={() => {
              setInvert(!invert);
              console.log("Invertir:", !invert);
            }}
          />
          <label htmlFor="image" className="form-label">
            Selecciona una imagen:
          </label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full p-2 text-sm text-slate-700 border border-s-amber-400 rounded-lg cursor-pointer bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {file && (
            <p className="mt-2 text-sm text-blue-800">
              Archivo seleccionado: {file.name}
            </p>
          )}
        </div>
        {preview && (
          <div className="flex justify-center">
            <img
              src={preview}
              alt="Vista previa"
              className="max-h-40 rounded-lg border-slate-200 shadow-md"
            />
          </div>
        )}
        <div className="flex flex- p-3 sm:flex-row gap-4 justify-center mt-4 ">
          <button
            type="submit"
            disabled={loading}
            className="w-25 py-2 px-4 rounded-lg text-blue-700 font-medium shadow-md bg-red-600"
          >
            {loading ? "Subiendo imagen..." : "Enviar"}
          </button>

          <button
            type="button"
            onClick={() => Navigate("/History")}
            className="w-25 py-2 px-4 rounded-lg text-red-600 font-medium shadow-md bg-blue-600 text-center"
          >
            Historial
          </button>
        </div>
      </form>
      {ImageResponse && (
        <div className="max-w-md mx-auto mt-10 p-6 bg-yellow-300 rounded-4xl shadow-lg space-y-6 ">
          <h2 className="text-2xl font-bold text-slate-900 text-center">
            Resultados del reconocimiento
          </h2>
          <p className="text-xl ">Predicción: {ImageResponse.prediction}</p>
          <p className="text-lg">
            Precisión:{" "}
            <span
              className={`${
                ImageResponse.accuracy > 50 ? "text-green-600" : "text-red-600"
              }`}
            >
              {ImageResponse.accuracy}%{" "}
            </span>
          </p>
          <p className="text-lg">
            Tiempo de procesamiento: {ImageResponse.process_time}
          </p>
        </div>
      )}
    </>
  );
}

export { ImageForm };
