import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Login from "./pages/Login.jsx";
import MeuPainel from "./pages/MeuPainel.jsx";
import EditarPerfil from "./pages/EditarPerfil.jsx";

import Explorar from "./pages/Explorar.jsx";
import Tours from "./pages/Tours.jsx";
import CityPage from "./pages/CityPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<MeuPainel />} />
          <Route path="perfil/editar" element={<EditarPerfil />} />

          <Route path="explorar" element={<Explorar />} />
          <Route path="tours" element={<Tours />} />
          <Route path="cidade/:cityName" element={<CityPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
