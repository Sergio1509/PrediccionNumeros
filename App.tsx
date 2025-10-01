import { Route, Routes } from "react-router";
import { ImageForm } from "./components/ImageForm";
import { History } from "./components/History";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ImageForm />} />
      <Route path="/History" element={<History />} />
    </Routes>
  );
}

export default App;
