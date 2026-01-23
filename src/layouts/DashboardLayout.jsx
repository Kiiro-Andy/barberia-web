import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/TopBar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
