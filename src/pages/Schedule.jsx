import { useState } from "react";
import Swal from "sweetalert2";

const initialSchedule = [
  { day: "Lunes", enabled: true, from: "09:00", to: "18:00" },
  { day: "Martes", enabled: true, from: "09:00", to: "18:00" },
  { day: "Miércoles", enabled: true, from: "09:00", to: "18:00" },
  { day: "Jueves", enabled: true, from: "09:00", to: "18:00" },
  { day: "Viernes", enabled: true, from: "09:00", to: "18:00" },
  { day: "Sábado", enabled: true, from: "10:00", to: "15:00" },
  { day: "Domingo", enabled: false, from: "", to: "" },
];

const timeOptions = [
  "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30",
  "22:00"
];


export default function Schedule() {
  const [schedule, setSchedule] = useState(initialSchedule);

  const handleChange = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  const handleSave = () => {
    Swal.fire({
      title: "Horarios actualizados",
      text: "Tu disponibilidad fue guardada correctamente.",
      icon: "success",
      confirmButtonColor: "#C0A060",
      confirmButtonText: "Perfecto",
    });
  };

  return (
    <section className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-barber-black">
          Horarios y disponibilidad
        </h2>
        <p className="text-sm text-barber-gray">
          Define cuándo estás disponible para recibir citas
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-barber-white border border-barber-gray/30 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-barber-light text-barber-gray">
            <tr>
              <th className="px-6 py-4 text-left">Día</th>
              <th className="px-6 py-4 text-center">Disponible</th>
              <th className="px-6 py-4 text-center">Desde</th>
              <th className="px-6 py-4 text-center">Hasta</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {schedule.map((day, index) => (
              <tr
                key={day.day}
                className="hover:bg-barber-light/40 transition"
              >
                <td className="px-6 py-4 font-medium text-barber-black">
                  {day.day}
                </td>

                <td className="px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={day.enabled}
                    onChange={(e) =>
                      handleChange(index, "enabled", e.target.checked)
                    }
                    className="w-4 h-4 accent-barber-gold cursor-pointer"
                  />
                </td>

                <td className="px-6 py-4 text-center">
                  <input
                    type="time"
                    value={day.from}
                    disabled={!day.enabled}
                    onChange={(e) =>
                      handleChange(index, "from", e.target.value)
                    }
                    className="input max-w-[120px] mx-auto disabled:opacity-50"
                  />
                </td>

                <td className="px-6 py-4 text-center">
                  <input
                    type="time"
                    value={day.to}
                    disabled={!day.enabled}
                    onChange={(e) =>
                      handleChange(index, "to", e.target.value)
                    }
                    className="input max-w-[120px] mx-auto disabled:opacity-50"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="btn-primary max-w-xs"
        >
          Guardar cambios
        </button>
      </div>
    </section>
  );
}
