import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Plus, Trash2 } from "lucide-react";
import supabase from "../utils/supabase";

/* ======================
   HELPERS
====================== */
const timeToMinutes = (time) => {
  if (!time) return 0;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

/* ======================
   BASE DATA
====================== */
const baseSchedule = [
  { day: "Lunes", enabled: true, from: "09:00", to: "18:00" },
  { day: "Martes", enabled: true, from: "09:00", to: "18:00" },
  { day: "Miércoles", enabled: true, from: "09:00", to: "18:00" },
  { day: "Jueves", enabled: true, from: "09:00", to: "18:00" },
  { day: "Viernes", enabled: true, from: "09:00", to: "18:00" },
  { day: "Sábado", enabled: true, from: "10:00", to: "15:00" },
  { day: "Domingo", enabled: false, from: "", to: "" },
];

const generateHours = () => {
  const hours = [];
  for (let h = 6; h <= 22; h++) {
    ["00", "30"].forEach((m) => {
      hours.push(`${String(h).padStart(2, "0")}:${m}`);
    });
  }
  return hours;
};

const hours = generateHours();

export default function Schedule() {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBarberId, setActiveBarberId] = useState(null);
  const activeBarber = barbers.find((b) => b.id === activeBarberId);

  /* ======================
     LOAD BARBERS FROM SUPABASE
  ====================== */
  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    try {
      setLoading(true);

      // Consultar profiles con rol barbero
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("rol", "barbero");

      if (error) throw error;

      // Mapear los barberos con su schedule
      const loadedBarbers = data.map((profile) => ({
        id: profile.id,
        name: profile.nombre || profile.email,
        email: profile.email,
        phone: profile.telefono,
        schedule: structuredClone(baseSchedule),
      }));

      setBarbers(loadedBarbers);
      
      // Establecer el primer barbero como activo
      if (loadedBarbers.length > 0) {
        setActiveBarberId(loadedBarbers[0].id);
      }
    } catch (error) {
      console.error("Error loading barbers:", error);
      Swal.fire({
        icon: "error",
        title: "Error al cargar barberos",
        text: error.message || "No se pudieron cargar los barberos",
        confirmButtonColor: "#C0A060",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     UPDATE DAY (VALIDADO)
  ====================== */
  const updateDay = (index, field, value) => {
    setBarbers((prev) =>
      prev.map((barber) => {
        if (barber.id !== activeBarberId) return barber;

        const updatedSchedule = barber.schedule.map((day, i) => {
          if (i !== index) return day;

          const updatedDay = { ...day, [field]: value };

          if (
            updatedDay.enabled &&
            updatedDay.from &&
            updatedDay.to
          ) {
            const fromMin = timeToMinutes(updatedDay.from);
            const toMin = timeToMinutes(updatedDay.to);

            if (fromMin >= toMin) {
              Swal.fire({
                icon: "error",
                title: "Horario inválido",
                text:
                  "La hora de salida debe ser mayor a la hora de entrada. No se permiten horarios que crucen al día siguiente.",
                confirmButtonColor: "#C0A060",
              });

              return day; // ❌ bloquea el cambio
            }
          }

          return updatedDay;
        });

        return { ...barber, schedule: updatedSchedule };
      })
    );
  };

  /* ======================
     ADD BARBER
  ====================== */
  const addBarber = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Nuevo barbero",
      html: `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <input id="swal-name" class="swal2-input" placeholder="Nombre" style="margin: 0;">
          <input id="swal-email" type="email" class="swal2-input" placeholder="Email" style="margin: 0;">
          <input id="swal-phone" type="tel" class="swal2-input" placeholder="Teléfono" style="margin: 0;">
          <input id="swal-password" type="password" class="swal2-input" placeholder="Contraseña" style="margin: 0;">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Agregar",
      confirmButtonColor: "#C0A060",
      cancelButtonText: "Cancelar",
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById("swal-name").value;
        const email = document.getElementById("swal-email").value;
        const phone = document.getElementById("swal-phone").value;
        const password = document.getElementById("swal-password").value;

        if (!name || !email || !phone || !password) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }

        if (password.length < 6) {
          Swal.showValidationMessage("La contraseña debe tener al menos 6 caracteres");
          return false;
        }

        return { name, email, phone, password };
      },
    });

    if (!formValues) return;

    // Mostrar loader mientras se procesa
    Swal.fire({
      title: "Registrando barbero...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formValues.email,
        password: formValues.password,
        options: {
          data: {
            name: formValues.name,
            phone: formValues.phone,
            rol: "barbero",
          },
        },
      });

      if (error) throw error;

      // Insertar en la tabla profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          email: formValues.email,
          nombre: formValues.name,
          telefono: formValues.phone,
          rol: "barbero",
        });

      if (profileError) throw profileError;

      // Recargar barberos desde la base de datos
      await loadBarbers();

      Swal.fire({
        icon: "success",
        title: "Barbero agregado",
        html: `
          <p><strong>${formValues.name}</strong> fue registrado correctamente.</p>
          <p class="text-sm text-gray-500 mt-2">Email: ${formValues.email}</p>
          <p class="text-sm text-gray-500">Teléfono: ${formValues.phone}</p>
        `,
        confirmButtonColor: "#C0A060",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: error.message || "No se pudo registrar al barbero. Intenta de nuevo.",
        confirmButtonColor: "#C0A060",
      });
    }
  };

  /* ======================
     DELETE BARBER
  ====================== */
  const deleteBarber = async () => {
    if (barbers.length === 1) {
      Swal.fire({
        icon: "warning",
        title: "Acción no permitida",
        text: "Debe existir al menos un barbero",
        confirmButtonColor: "#C0A060",
      });
      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: `¿Eliminar a ${activeBarber.name}?`,
      text: "Esta acción no se puede deshacer",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#9B1C1C",
    });

    if (!result.isConfirmed) return;

    // Mostrar loader
    Swal.fire({
      title: "Eliminando barbero...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // Eliminar de la tabla profiles
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", activeBarberId);

      if (error) throw error;

      // Recargar barberos
      await loadBarbers();

      Swal.fire({
        icon: "success",
        title: "Barbero eliminado",
        text: `${activeBarber.name} fue eliminado correctamente`,
        confirmButtonColor: "#C0A060",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: error.message || "No se pudo eliminar al barbero. Intenta de nuevo.",
        confirmButtonColor: "#C0A060",
      });
    }
  };

  /* ======================
     SAVE
  ====================== */
  const saveSchedule = () => {
    Swal.fire({
      icon: "success",
      title: "Horario actualizado",
      text: `El horario de ${activeBarber.name} fue guardado`,
      confirmButtonColor: "#C0A060",
    });
  };

  return (
    <section className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-barber-black">
          Horarios por barbero
        </h2>
        <p className="text-sm text-barber-gray">
          Administra la disponibilidad de cada barbero
        </p>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-barber-gray">Cargando barberos...</p>
        </div>
      )}

      {/* NO BARBERS STATE */}
      {!loading && barbers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-barber-gray mb-4">No hay barberos registrados</p>
          <button
            onClick={addBarber}
            className="btn-primary"
          >
            <Plus size={16} className="inline mr-2" />
            Agregar primer barbero
          </button>
        </div>
      )}

      {/* BARBER SELECTOR */}
      {!loading && barbers.length > 0 && (
        <>
          <div className="flex gap-3 flex-wrap items-center">
            {barbers.map((barber) => (
              <button
                key={barber.id}
                onClick={() => setActiveBarberId(barber.id)}
                className={`
                  px-4 py-2 rounded-full border text-sm font-medium transition
                  ${
                    barber.id === activeBarberId
                      ? "bg-barber-gold text-barber-black border-barber-gold"
                      : "bg-barber-white border-barber-gray/30 hover:bg-barber-light"
                  }
                `}
              >
                {barber.name}
              </button>
            ))}

            <button
              onClick={addBarber}
              className="flex items-center gap-1 px-3 py-2 rounded-full border border-dashed border-barber-gray text-barber-gray hover:bg-barber-light"
            >
              <Plus size={16} />
              Agregar
            </button>

            <button
              onClick={deleteBarber}
              className="flex items-center gap-1 px-3 py-2 rounded-full border border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={16} />
              Eliminar
            </button>
          </div>

          {/* SCHEDULE */}
          {activeBarber && (
            <>
              <div className="grid gap-4">
                {activeBarber.schedule.map((day, index) => (
                  <div
                    key={day.day}
                    className="flex items-center justify-between bg-barber-white border border-barber-gray/30 rounded-xl p-4"
                  >
                    <div>
                      <p className="font-medium text-barber-black">{day.day}</p>
                      {!day.enabled && (
                        <p className="text-xs text-barber-gray">No disponible</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={day.enabled}
                        onChange={(e) =>
                          updateDay(index, "enabled", e.target.checked)
                        }
                        className="w-4 h-4 accent-barber-gold"
                      />

                      {day.enabled && (
                        <>
                          <select
                            value={day.from}
                            onChange={(e) =>
                              updateDay(index, "from", e.target.value)
                            }
                            className="input w-28"
                          >
                            {hours.map((hour) => (
                              <option key={hour} value={hour}>
                                {hour}
                              </option>
                            ))}
                          </select>

                          <span className="text-barber-gray">–</span>

                          <select
                            value={day.to}
                            onChange={(e) =>
                              updateDay(index, "to", e.target.value)
                            }
                            className="input w-28"
                          >
                            {hours
                              .filter(
                                (hour) =>
                                  timeToMinutes(hour) >
                                  timeToMinutes(day.from)
                              )
                              .map((hour) => (
                                <option key={hour} value={hour}>
                                  {hour}
                                </option>
                              ))}
                          </select>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* SAVE */}
              <div className="flex justify-end">
                <button onClick={saveSchedule} className="btn-primary">
                  Guardar horarios
                </button>
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}
