import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import supabase from "../utils/supabase";
import {
  Plus,
  Pencil,
  Trash2,
  Scissors,
  Clock,
  DollarSign,
} from "lucide-react";

const BarberAlert = Swal.mixin({
  background: "#FFFFFF",
  color: "#141414",
  iconColor: "#C0A060",
  confirmButtonColor: "#C0A060",
  cancelButtonColor: "#7A1F2B",
  buttonsStyling: true,
  customClass: {
    popup: "rounded-2xl shadow-xl",
    title: "text-barber-black font-bold",
    htmlContainer: "text-barber-gray",
    confirmButton: "rounded-lg px-6 py-2 font-semibold text-barber-black",
    cancelButton: "rounded-lg px-6 py-2 font-semibold text-white",
  },
});

const durationOptions = [15, 20, 30, 45, 60, 75, 90];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Cargar servicios desde Supabase
  const loadServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('id, nombre, descripcion, precio')
        .order('id', { ascending: true });
      
      if (error) throw error;
      
      setServices(data || []);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      BarberAlert.fire({
        title: "Error",
        text: "No se pudieron cargar los servicios",
        icon: "error",
        confirmButtonText: "Entendido"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleDelete = (service) => {
    BarberAlert.fire({
      title: "¿Eliminar servicio?",
      html: `
      <p>
        El servicio <strong>${service.nombre}</strong> será eliminado
        y ya no estará disponible para agendar citas.
      </p>
    `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        BarberAlert.fire({
          title: "Servicio eliminado",
          text: "El servicio fue eliminado correctamente.",
          icon: "success",
          confirmButtonText: "Entendido",
        });
      }
    });
  };

  return (
    <section className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-barber-black flex items-center gap-2">
            <Scissors className="w-5 h-5 text-barber-gold" />
            Servicios
          </h2>

          <p className="text-xs sm:text-sm text-barber-gray">
            Administra los servicios que los clientes pueden agendar, define
            duración y precio.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedService(null);
            setOpenModal(true);
          }}
          className="
      w-full sm:w-auto
      flex items-center justify-center gap-2
      bg-barber-gold
      text-barber-black
      px-4 py-2
      rounded-lg
      font-semibold
      hover:opacity-90
      transition
    "
        >
          <Plus className="w-4 h-4" />
          Nuevo servicio
        </button>
      </div>

      {/* LISTADO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
        {fakeServices.map((service) => (
          <div
            key={service.id}
            className="
              bg-barber-white
              border border-barber-gray/30
              rounded-2xl
              overflow-hidden
              hover:shadow-md
              transition
            "
          >
            {/* IMAGE */}
            <div className="h-36 bg-barber-light flex items-center justify-center">
              <Scissors className="w-10 h-10 text-barber-gray" />
            </div>

            {/* CONTENT */}
            <div className="p-4 sm:p-5 space-y-3">
              <h3 className="text-lg font-semibold text-barber-black">
                {service.nombre}
              </h3>

              <p className="text-sm text-barber-gray">{service.descripcion}</p>

              <div className="flex flex-col gap-1 text-sm text-barber-gray">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-barber-gold" />
                  <span>${service.precio}</span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-2 pt-3">
                <button
                  onClick={() => {
                    setSelectedService(service);
                    setOpenModal(true);
                  }}
                  className="
                    flex-1 flex items-center justify-center gap-2
                    border border-barber-gold
                    text-barber-gold
                    py-2
                    rounded-lg
                    hover:bg-barber-gold
                    hover:text-barber-black
                    transition
                  "
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(service)}
                  className="
                    flex-1 flex items-center justify-center gap-2
                    border border-barber-wine
                    text-barber-wine
                    py-2
                    rounded-lg
                    hover:bg-barber-wine
                    hover:text-white
                    transition
                  "
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )))
        }
      </div>

      {/* MODAL */}
      {openModal && (
        <ServiceModal
          service={selectedService}
          onClose={() => setOpenModal(false)}
        />
      )}
    </section>
  );
}

function ServiceModal({ service, onClose }) {
  const isEdit = Boolean(service);

  const [form, setForm] = useState({
    name: service?.name || "",
    description: service?.description || "",
    duration: service?.duration || "",
    price: service?.price || "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = () => {
    if (!form.name || !form.duration || !form.price) {
      BarberAlert.fire({
        title: "Campos obligatorios",
        html: `
      <p class="text-barber-gray">
        Debes completar <strong>nombre</strong>, <strong>duración</strong>
        y <strong>precio</strong> para continuar.
      </p>
    `,
        icon: "warning",
        iconColor: "#0A192F",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#0A192F",
      });
      return;
    }

    BarberAlert.fire({
      title: isEdit ? "Servicio actualizado" : "Servicio creado",
      text: isEdit
        ? "Los cambios se guardaron correctamente."
        : "El servicio ya está disponible para agendar citas.",
      icon: "success",
      confirmButtonText: "Perfecto",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-barber-white w-full max-w-lg rounded-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg sm:text-xl font-bold text-barber-gold">
          {isEdit ? "Editar servicio" : "Nuevo servicio"}
        </h3>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre del servicio *"
          className="input"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción"
          className="input"
          rows={3}
        />

        <select
          name="duration"
          value={form.duration}
          onChange={handleChange}
          className="input"
        >
          <option value="">Duración *</option>
          {durationOptions.map((min) => (
            <option key={min} value={`${min} min`}>
              {min} minutos
            </option>
          ))}
        </select>

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Precio *"
          min={0}
          step={10}
          className="input"
        />

        <input
          type="file"
          accept="image/png, image/jpeg"
          name="image"
          onChange={handleChange}
          className="input"
        />

        <div className="flex flex-col sm:flex-row gap-2 pt-3">
          <button onClick={onClose} className="btn-secondary w-full">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="btn-primary w-full">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
