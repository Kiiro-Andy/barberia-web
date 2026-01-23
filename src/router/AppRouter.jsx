import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Services from "../pages/Services";
import Appointments from "../pages/Appointments";
import Schedule from "../pages/Schedule";
import DashboardLayout from "../layouts/DashboardLayout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="services" element={<Services />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="schedule" element={<Schedule />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
