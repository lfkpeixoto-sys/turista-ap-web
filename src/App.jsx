import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import Login from "./pages/Login.jsx";
import MeuPainel from "./pages/MeuPainel.jsx";
import EditarPerfil from "./pages/EditarPerfil.jsx";
import Ranking from "./pages/Ranking.jsx";

import Explorar from "./pages/Explorar.jsx";
import Tours from "./pages/Tours.jsx";
import Reservas from "./pages/Reservas.jsx";
import CityPage from "./pages/CityPage.jsx";
import Planos from "./pages/Planos.jsx";

import Favoritos from "./pages/Favoritos.jsx";
import Recompensas from "./pages/Recompensas.jsx";
import Offline from "./pages/Offline.jsx";

// ✅ NOVO
import PublicProfile from "./pages/PublicProfile.jsx";
import UsernameOnboarding from "./pages/UsernameOnboarding.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* ✅ PERFIL PÚBLICO (sem login) */}
        <Route path="/u/:username" element={<PublicProfile />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="onboarding/username" element={<UsernameOnboarding />} />

          <Route index element={<MeuPainel />} />
          <Route path="perfil/editar" element={<EditarPerfil />} />
          <Route path="ranking" element={<Ranking />} />

          <Route path="explorar" element={<Explorar />} />
          <Route path="tours" element={<Tours />} />
          <Route path="reservas" element={<Reservas />} />
          <Route path="planos" element={<Planos />} />

          <Route path="favoritos" element={<Favoritos />} />
          <Route path="recompensas" element={<Recompensas />} />
          <Route path="offline" element={<Offline />} />

          <Route path="cidade/:cityName" element={<CityPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
