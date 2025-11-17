import Sidebar from "../components/Sidebar";
import "../index.css";

export default function MinhasReservas() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Minhas Reservas</h1>
      </div>
    </div>
  );
}
