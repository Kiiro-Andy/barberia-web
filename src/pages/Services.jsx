import { useState } from "react";
import Swal from "sweetalert2";
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

const fakeServices = [
  {
    id: 1,
    name: "Corte de Cabello",
    description: "Corte clásico o moderno",
    duration: "30 min",
    price: "$150",
    image: null,
  },
  {
    id: 2,
    name: "Barba",
    description: "Perfilado y arreglo de barba",
    duration: "20 min",
    price: "$100",
    image: null,
  },
  {
    id: 3,
    name: "Corte + Barba",
    description: "Corte de cabello y perfilado de barba",
    duration: "50 min",
    price: "$200",
    image: null,
  },
  {
    id: 4,
    name: "Corte de Cabello",
    description: "Corte Buzzcut o rapado",
    duration: "30 min",
    price: "$190",
    image: null,
  },
];

export default function Services() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleDelete = (service) => {
    BarberAlert.fire({
      title: "¿Eliminar servicio?",
      html: `
      <p>
        El servicio <strong>${service.name}</strong> será eliminado
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
        <div>
          <h2 className="text-2xl font-bold text-barber-black flex items-center gap-2">
            <Scissors className="w-5 h-5 text-barber-gold" />
            Servicios
          </h2>

          <p className="text-sm text-barber-gray mt-1">
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
      flex items-center gap-2
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="p-5 space-y-2">
              <h3 className="text-lg font-semibold text-barber-black">
                {service.name}
              </h3>

              <p className="text-sm text-barber-gray">{service.description}</p>

              <div className="flex flex-col gap-1 text-sm text-barber-gray">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-barber-gold" />
                  <span>{service.duration}</span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-barber-gold" />
                  <span>{service.price}</span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 pt-4">
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
        ))}
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-barber-white w-full max-w-lg rounded-2xl p-6 space-y-4">
        <h3 className="text-xl font-bold text-barber-gold">
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
        />

        <select
          name="duration"
          value={form.duration}
          onChange={handleChange}
          className="input"
        >
          <option value="">Duración *</option>
          {durationOptions.map((min) => (
            <option key={min} value={min}>
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

        <div className="flex gap-3 pt-4">
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="btn-primary">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
