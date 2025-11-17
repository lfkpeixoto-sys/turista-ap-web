import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Explorar from "./pages/Explorar.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route path="explorar" element={<Explorar />} />
          {/* Outras abas podem ser adicionadas aqui */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
