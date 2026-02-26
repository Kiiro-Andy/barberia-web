import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Appointments from "./pages/Appointments";
import Schedule from "./pages/Schedule";
import { BarberProvider } from "./context/BarberContext";

export default function App() {
  return (
    <BarberProvider>
      <BrowserRouter>
        <Routes>
          {/* LOGIN */}
          <Route path="/" element={<Login />} />

          {/* DASHBOARD */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="services" element={<Services />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="schedule" element={<Schedule />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BarberProvider>
  );
}
