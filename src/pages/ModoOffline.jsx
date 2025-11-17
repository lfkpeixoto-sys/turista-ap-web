import Sidebar from "../components/Sidebar";
import "../index.css";

export default function ModoOffline() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Modo Offline</h1>
      </div>
    </div>
  );
}
