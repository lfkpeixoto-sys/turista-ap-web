import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Explorar from "./pages/Explorar.jsx";
import CityPage from "./pages/CityPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route path="explorar" element={<Explorar />} />
          <Route path="cidade/:cityName" element={<CityPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
