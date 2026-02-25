import { useState } from "react";
import Swal from "sweetalert2";
import { Plus, Trash2, Layers } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/calendar-custom.css";

const generateHours = (start = 9, end = 17) => {
  const hours = [];
  for (let h = start; h < end; h++) {
    hours.push(`${String(h).padStart(2, "0")}:00`);
    hours.push(`${String(h).padStart(2, "0")}:30`);
  }
  return hours;
};

const hours = generateHours(9, 17);

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const safeDateFromString = (dateStr) => {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
};

const formatDisplayDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

export default function Schedule() {
  const [barbers, setBarbers] = useState([
    { id: 1, name: "Carlos", availability: {} },
    { id: 2, name: "Miguel", availability: {} },
  ]);

  const [activeBarberId, setActiveBarberId] = useState(1);
  const activeBarber = barbers.find((b) => b.id === activeBarberId);

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(formatDate(today));
  const [selectedDates, setSelectedDates] = useState([]);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [multiSelectedHours, setMultiSelectedHours] = useState([]);
  const [bulkModeType, setBulkModeType] = useState(null);

  const getDateConfig = (dateStr) => {
    return activeBarber.availability[dateStr] || null;
  };

  // ========== DESHABILITAR DÍAS PASADOS ==========
  const isDateDisabled = ({ date, view }) => {
    if (view !== "month") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  // ========== FUNCIONES INDIVIDUALES ==========
  const setVacation = (dateStr) => {
    setBarbers((prev) =>
      prev.map((barber) => {
        if (barber.id !== activeBarberId) return barber;
        return {
          ...barber,
          availability: {
            ...barber.availability,
            [dateStr]: { type: "vacation", slots: [] },
          },
        };
      })
    );
  };

  const setWorkDay = (dateStr) => {
    setBarbers((prev) =>
      prev.map((barber) => {
        if (barber.id !== activeBarberId) return barber;
        const existing = barber.availability[dateStr];
        const newConfig = {
          type: "work",
          slots: existing?.type === "work" ? existing.slots : [],
        };
        return {
          ...barber,
          availability: { ...barber.availability, [dateStr]: newConfig },
        };
      })
    );
  };

  const toggleSlotForDate = (dateStr, hour) => {
    setBarbers((prev) =>
      prev.map((barber) => {
        if (barber.id !== activeBarberId) return barber;
        const current = barber.availability[dateStr] || { type: "work", slots: [] };
        if (current.type === "vacation") return barber;
        const exists = current.slots.includes(hour);
        const newSlots = exists
          ? current.slots.filter((h) => h !== hour)
          : [...current.slots, hour].sort();
        return {
          ...barber,
          availability: {
            ...barber.availability,
            [dateStr]: { type: "work", slots: newSlots },
          },
        };
      })
    );
  };

  const removeDateConfig = (dateStr) => {
    setBarbers((prev) =>
      prev.map((barber) => {
        if (barber.id !== activeBarberId) return barber;
        const newAvailability = { ...barber.availability };
        delete newAvailability[dateStr];
        return { ...barber, availability: newAvailability };
      })
    );
  };

  // ========== SELECCIÓN MÚLTIPLE ==========
  const handleDayClick = (date) => {
    const dateStr = formatDate(date);
    if (multiSelectMode) {
      setSelectedDates((prev) =>
        prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
      );
    } else {
      setSelectedDate(dateStr);
    }
  };

  const clearSelection = () => {
    setSelectedDates([]);
    setMultiSelectedHours([]);
    setBulkModeType(null);
  };

  const exitMultiMode = () => {
    setMultiSelectMode(false);
    setBulkModeType(null);
    clearSelection();
  };

  const applyToSelected = (action, slots = null) => {
    if (selectedDates.length === 0) return;
    setBarbers((prev) =>
      prev.map((barber) => {
        if (barber.id !== activeBarberId) return barber;
        const newAvailability = { ...barber.availability };
        selectedDates.forEach((dateStr) => {
          if (action === "vacation") {
            newAvailability[dateStr] = { type: "vacation", slots: [] };
          } else if (action === "work") {
            const existing = newAvailability[dateStr];
            if (existing && existing.type === "work") {
              newAvailability[dateStr] = { ...existing, type: "work" };
            } else {
              newAvailability[dateStr] = { type: "work", slots: [] };
            }
          } else if (action === "slots") {
            newAvailability[dateStr] = { type: "work", slots: [...slots] };
          } else if (action === "remove") {
            delete newAvailability[dateStr];
          }
        });
        return { ...barber, availability: newAvailability };
      })
    );

    Swal.fire({
      icon: "success",
      title: "Aplicado",
      text: `Configuración aplicada a ${selectedDates.length} día(s)`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleMultiSlotToggle = (hour) => {
    setMultiSelectedHours((prev) =>
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour].sort()
    );
  };

  // ========== BARBEROS ==========
  const addBarber = async () => {
    const { value: name } = await Swal.fire({
      title: "Nuevo barbero",
      input: "text",
      inputPlaceholder: "Nombre del barbero",
      showCancelButton: true,
      confirmButtonText: "Agregar",
      confirmButtonColor: "#C0A060",
      cancelButtonText: "Cancelar",
    });
    if (!name) return;
    const newBarber = {
      id: Date.now(),
      name,
      availability: {},
    };
    setBarbers((prev) => [...prev, newBarber]);
    setActiveBarberId(newBarber.id);
    exitMultiMode();
    Swal.fire({
      icon: "success",
      title: "Barbero agregado",
      text: `${name} fue agregado correctamente`,
      confirmButtonColor: "#C0A060",
    });
  };

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
    const updated = barbers.filter((b) => b.id !== activeBarberId);
    setBarbers(updated);
    setActiveBarberId(updated[0].id);
    exitMultiMode();
    Swal.fire({
      icon: "success",
      title: "Barbero eliminado",
      text: `${activeBarber.name} fue eliminado correctamente`,
      confirmButtonColor: "#C0A060",
    });
  };

  const saveSchedule = () => {
    Swal.fire({
      icon: "success",
      title: "Horario actualizado",
      text: `La disponibilidad de ${activeBarber.name} fue guardada`,
      confirmButtonColor: "#C0A060",
    });
  };

  return (
    <section className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-barber-black">
          Horarios por barbero
        </h2>
        <p className="text-sm text-barber-gray">
          Administra la disponibilidad de cada barbero
        </p>
      </div>

      {/* BARBER SELECTOR */}
      <div className="flex gap-2 sm:gap-3 flex-wrap items-center">
        {barbers.map((barber) => (
          <button
            key={barber.id}
            onClick={() => {
              setActiveBarberId(barber.id);
              exitMultiMode();
            }}
            className={`
              px-3 sm:px-4 py-2 rounded-full border text-xs sm:text-sm font-medium transition
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
          className="flex items-center gap-1 px-3 sm:px-4 py-2 rounded-full border border-dashed border-barber-gray text-xs sm:text-sm text-barber-gray hover:bg-barber-light"
        >
          <Plus size={16} />
          Agregar
        </button>
        <button
          onClick={deleteBarber}
          className="flex items-center gap-1 px-3 sm:px-4 py-2 rounded-full border border-red-300 text-xs sm:text-sm text-red-600 hover:bg-red-50"
        >
          <Trash2 size={16} />
          Eliminar
        </button>
      </div>

      {/* SCHEDULE */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* CALENDARIO */}
        <div className="bg-barber-white rounded-2xl border border-barber-gray/30 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h3 className="font-semibold text-barber-black text-base sm:text-lg">
              Calendario de disponibilidad
            </h3>
            <button
              onClick={() => {
                if (multiSelectMode) {
                  exitMultiMode();
                } else {
                  setMultiSelectMode(true);
                  setSelectedDates([]);
                }
              }}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border whitespace-nowrap ${
                multiSelectMode
                  ? "bg-barber-gold border-barber-gold text-barber-black"
                  : "border-barber-gray/30 hover:bg-barber-light"
              }`}
            >
              <Layers size={14} />
              {multiSelectMode ? "Salir de selección múltiple" : "Selección múltiple"}
            </button>
          </div>

          <Calendar
            onClickDay={handleDayClick}
            value={multiSelectMode ? null : safeDateFromString(selectedDate)}
            tileClassName={({ date, view }) => {
              if (view !== "month") return "";
              const dateStr = formatDate(date);
              const config = activeBarber.availability[dateStr];
              let className = "";
              if (!config) className = "unconfigured-day";
              else if (config.type === "vacation") className = "vacation-day";
              else if (config.type === "work") className = "work-day";

              if (multiSelectMode && selectedDates.includes(dateStr)) {
                className += " selected-multi";
              }
              return className;
            }}
            tileContent={({ date, view }) => {
              if (view !== "month") return null;
              const dateStr = formatDate(date);
              const config = activeBarber.availability[dateStr];
              if (!config) return null;
              return (
                <div className="flex justify-center mt-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      config.type === "vacation" ? "bg-sky-500" : "bg-green-500"
                    }`}
                  />
                </div>
              );
            }}
            tileDisabled={isDateDisabled}
          />

          {multiSelectMode && (
            <div className="mt-4 text-xs sm:text-sm text-barber-gray">
              {selectedDates.length} día(s) seleccionado(s). Haz clic en los días para
              seleccionar o deseleccionar.
            </div>
          )}
        </div>

        {/* PANEL DE CONFIGURACIÓN */}
        <div className="bg-barber-white rounded-2xl border border-barber-gray/30 p-4 sm:p-6 space-y-4 sm:space-y-6">
          {multiSelectMode && selectedDates.length > 0 ? (
            // Vista de acciones múltiples
            <>
              <h3 className="font-semibold text-barber-black text-base sm:text-lg">
                Acciones para {selectedDates.length} día(s) seleccionado(s)
              </h3>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setBulkModeType("work");
                    setMultiSelectedHours([]);
                    applyToSelected("work");
                  }}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex-1 sm:flex-none ${
                    bulkModeType === "work"
                      ? "bg-green-600 text-white shadow"
                      : "bg-gray-100 hover:bg-green-50"
                  }`}
                >
                  Marcar como laboral
                </button>

                <button
                  onClick={() => {
                    setBulkModeType("vacation");
                    setMultiSelectedHours([]);
                    applyToSelected("vacation");
                  }}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex-1 sm:flex-none ${
                    bulkModeType === "vacation"
                      ? "bg-red-600 text-white shadow"
                      : "bg-gray-100 hover:bg-red-50"
                  }`}
                >
                  Vacaciones
                </button>

                <button
                  onClick={() => applyToSelected("remove")}
                  className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-gray-600 text-white hover:bg-gray-700 flex-1 sm:flex-none"
                >
                  Eliminar
                </button>
              </div>

              {bulkModeType === "work" && (
                <div className="space-y-4">
                  <p className="text-xs text-barber-gray">
                    Selecciona horas para aplicar a todos los días laborales
                  </p>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[250px] sm:max-h-[300px] overflow-y-auto">
                    {hours.map((hour) => {
                      const isSelected = multiSelectedHours.includes(hour);
                      return (
                        <button
                          key={hour}
                          onClick={() => handleMultiSlotToggle(hour)}
                          className={`px-1 sm:px-2 py-1 rounded-md text-[10px] sm:text-xs font-medium transition ${
                            isSelected
                              ? "bg-barber-gold text-barber-black"
                              : "bg-barber-light hover:bg-barber-gold/20"
                          }`}
                        >
                          {hour}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => applyToSelected("slots", multiSelectedHours)}
                    className="w-full px-4 py-2 rounded-md text-sm bg-barber-gold text-barber-black hover:bg-barber-gold/80"
                  >
                    Aplicar horas seleccionadas
                  </button>
                </div>
              )}

              <div className="flex justify-end mt-4">
                <button
                  onClick={clearSelection}
                  className="text-xs sm:text-sm text-barber-gray hover:underline"
                >
                  Limpiar selección
                </button>
              </div>
            </>
          ) : (
            // Vista individual
            selectedDate && (
              <>
                <h3 className="font-semibold text-barber-black text-base sm:text-lg">
                  Configuración para {formatDisplayDate(selectedDate)}
                </h3>
                {(() => {
                  const config = getDateConfig(selectedDate);
                  const isVacation = config?.type === "vacation";
                  const isWorkDay = config?.type === "work";

                  return (
                    <>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setWorkDay(selectedDate)}
                          className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex-1 sm:flex-none ${
                            isWorkDay
                              ? "bg-green-600 text-white shadow"
                              : "bg-gray-100 text-gray-700 hover:bg-green-50"
                          }`}
                        >
                          Día laboral
                        </button>

                        <button
                          onClick={() => setVacation(selectedDate)}
                          className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex-1 sm:flex-none ${
                            isVacation
                              ? "bg-red-600 text-white shadow"
                              : "bg-gray-100 text-gray-700 hover:bg-red-50"
                          }`}
                        >
                          Vacaciones
                        </button>
                      </div>

                      {isWorkDay && (
                        <div className="space-y-4 mt-4">
                          <p className="text-xs text-barber-gray">
                            Selecciona las horas disponibles
                          </p>
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[250px] sm:max-h-[300px] overflow-y-auto">
                            {hours.map((hour) => {
                              const isSelected = config.slots.includes(hour);
                              return (
                                <button
                                  key={hour}
                                  onClick={() =>
                                    toggleSlotForDate(selectedDate, hour)
                                  }
                                  className={`px-1 sm:px-2 py-1 rounded-md text-[10px] sm:text-xs font-medium transition ${
                                    isSelected
                                      ? "bg-barber-gold text-barber-black"
                                      : "bg-barber-light hover:bg-barber-gold/20"
                                  }`}
                                >
                                  {hour}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end mt-4">
                        <button
                          onClick={() => removeDateConfig(selectedDate)}
                          className="text-xs sm:text-sm text-red-600 hover:underline"
                        >
                          Eliminar configuración de este día
                        </button>
                      </div>
                    </>
                  );
                })()}
              </>
            )
          )}
        </div>
      </div>

      {/* SAVE */}
      <div className="flex justify-end">
        <button onClick={saveSchedule} className="btn-primary w-full sm:w-auto">
          Guardar horarios
        </button>
      </div>
    </section>
  );
}