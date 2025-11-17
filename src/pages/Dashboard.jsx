import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import "../index.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}
