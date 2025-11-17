import Sidebar from "../components/Sidebar";
import "../index.css";

export default function Favoritos() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Favoritos</h1>
      </div>
    </div>
  );
}
