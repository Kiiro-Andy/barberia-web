import { useState } from "react";
import Swal from "sweetalert2";
import {
  Clock,
  CheckCircle,
  XCircle,
  Check,
  Edit,
  Trash2,
} from "lucide-react";

/* ================= ALERT CONFIG ================= */
const BarberAlert = Swal.mixin({
  confirmButtonColor: "#C0A060",
  cancelButtonColor: "#7A1F2B",
  buttonsStyling: true,
});

/* ================= MOCK DATA ================= */
const appointmentsMock = [
  {
    id: 1,
    client: "Juan Pérez",
    barber: { id: 1, name: "Carlos" },
    service: "Corte clásico",
    date: "2026-01-25",
    time: "14:00",
    status: "Pendiente",
  },
  {
    id: 2,
    client: "Carlos Ramírez",
    barber: { id: 2, name: "Miguel" },
    service: "Barba premium",
    date: "2026-01-25",
    time: "16:30",
    status: "Confirmada",
  },
  {
    id: 3,
    client: "Luis Gómez",
    barber: { id: 1, name: "Carlos" },
    service: "Corte + barba",
    date: "2026-01-26",
    time: "11:00",
    status: "Cancelada",
  },
];

/* ================= MAIN COMPONENT ================= */
export default function Appointments() {
  const [appointments, setAppointments] = useState(appointmentsMock);
  const [filterStatus, setFilterStatus] = useState("Todas");
  const [searchClient, setSearchClient] = useState("");
  const [filterBarber, setFilterBarber] = useState("Todos");
  const [editingAppointment, setEditingAppointment] = useState(null);

  /* ================= BARBERS LIST ================= */
  const barbers = [
    ...new Set(appointments.map((a) => a.barber.name)),
  ];

  /* ================= FILTER LOGIC ================= */
  const filtered = appointments.filter((a) => {
    const statusMatch =
      filterStatus === "Todas" || a.status === filterStatus;

    const clientMatch = a.client
      .toLowerCase()
      .includes(searchClient.toLowerCase());

    const barberMatch =
      filterBarber === "Todos" || a.barber.name === filterBarber;

    return statusMatch && clientMatch && barberMatch;
  });

  /* ================= STATUS STYLES ================= */
  const statusStyles = {
    Pendiente: "bg-barber-navy/10 text-barber-navy",
    Confirmada: "bg-green-100 text-green-700",
    Cancelada: "bg-barber-wine/10 text-barber-wine",
  };

  const statusIcons = {
    Pendiente: <Clock className="w-4 h-4" />,
    Confirmada: <CheckCircle className="w-4 h-4" />,
    Cancelada: <XCircle className="w-4 h-4" />,
  };

  /* ================= ACTIONS ================= */
  const handleConfirm = (id) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "Confirmada" } : a
      )
    );

    BarberAlert.fire(
      "Cita confirmada",
      "La cita fue confirmada correctamente",
      "success"
    );
  };

  const handleCancel = (appointment) => {
    BarberAlert.fire({
      title: "¿Cancelar cita?",
      text: `La cita de ${appointment.client} será cancelada`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Volver",
    }).then((result) => {
      if (result.isConfirmed) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === appointment.id
              ? { ...a, status: "Cancelada" }
              : a
          )
        );

        BarberAlert.fire(
          "Cita cancelada",
          "La cita fue cancelada correctamente",
          "success"
        );
      }
    });
  };

  return (
    <section className="space-y-6 p-6">
      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl font-bold text-barber-black">
          Gestión de citas
        </h2>
        <p className="text-sm text-barber-gray">
          Visualiza, confirma, modifica o cancela citas
        </p>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="flex flex-wrap gap-3">
        <input
          placeholder="Buscar cliente"
          className="input w-56"
          value={searchClient}
          onChange={(e) => setSearchClient(e.target.value)}
        />

        {/* FILTRO POR BARBERO */}
        <select
          className="input w-48"
          value={filterBarber}
          onChange={(e) => setFilterBarber(e.target.value)}
        >
          <option value="Todos">Todos los barberos</option>
          {barbers.map((barber) => (
            <option key={barber}>{barber}</option>
          ))}
        </select>

        {["Todas", "Pendiente", "Confirmada", "Cancelada"].map(
          (state) => (
            <button
              key={state}
              onClick={() => setFilterStatus(state)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition
                ${
                  filterStatus === state
                    ? "bg-barber-gold text-barber-black"
                    : "bg-barber-light text-barber-gray hover:bg-barber-gold/20"
                }`}
            >
              {state}
            </button>
          )
        )}
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-barber-white rounded-2xl border border-barber-gray/30 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-barber-light text-barber-gray">
            <tr>
              <th className="px-6 py-4 text-left">Cliente</th>
              <th className="px-6 py-4 text-left">Barbero</th>
              <th className="px-6 py-4 text-left">Servicio</th>
              <th className="px-6 py-4 text-left">Fecha</th>
              <th className="px-6 py-4 text-left">Hora</th>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-barber-light/50">
                <td className="px-6 py-4 font-medium">{a.client}</td>
                <td className="px-6 py-4">{a.barber.name}</td>
                <td className="px-6 py-4">{a.service}</td>
                <td className="px-6 py-4">{a.date}</td>
                <td className="px-6 py-4">{a.time}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[a.status]}`}
                  >
                    {statusIcons[a.status]}
                    {a.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right space-x-2">
                  {a.status === "Pendiente" && (
                    <button
                      onClick={() => handleConfirm(a.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-green-100 text-green-700 hover:bg-green-200"
                    >
                      <Check className="w-4 h-4" />
                      Confirmar
                    </button>
                  )}

                  {a.status !== "Cancelada" && (
                    <button
                      onClick={() => setEditingAppointment(a)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-barber-gold/20 hover:bg-barber-gold"
                    >
                      <Edit className="w-4 h-4" />
                      Modificar
                    </button>
                  )}

                  <button
                    onClick={() => handleCancel(a)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-barber-wine/10 text-barber-wine hover:bg-barber-wine hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-6 text-center text-barber-gray">
            No hay citas para este filtro
          </div>
        )}
      </div>


      {/* ================= MODAL ================= */}
      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          onClose={() => setEditingAppointment(null)}
        />
      )}
    </section>
  );
}

/* ================= EDIT MODAL ================= */
function EditAppointmentModal({ appointment, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-barber-white w-full max-w-md rounded-2xl p-6 space-y-4">
        <h3 className="text-xl font-bold text-barber-gold">Reprogramar cita</h3>

        <input type="date" className="input" />
        <select className="input">
          <option>Seleccionar hora</option>
          <option>10:00</option>
          <option>11:00</option>
          <option>12:30</option>
        </select>

        <select className="input">
          <option>{appointment.service}</option>
          <option>Corte clásico</option>
          <option>Barba premium</option>
          <option>Corte + barba</option>
        </select>

        <div className="flex gap-3 pt-4">
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button
            onClick={() => {
              Swal.fire("Cita actualizada correctamente", "", "success");
              onClose();
            }}
            className="btn-primary"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
