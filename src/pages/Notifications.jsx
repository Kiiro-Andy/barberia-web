import { CalendarPlus, XCircle, Sparkles, Bell } from "lucide-react";

// 🔔 SIMULACIÓN DE BD
const notifications = [
  {
    id: 1,
    type: "new",
    text: "Nueva cita agendada para hoy a las 4:00 pm",
    time: "Hace 10 min",
    read: false,
  },
  {
    id: 2,
    type: "cancel",
    text: "Un cliente canceló su cita de mañana",
    time: "Hace 1 hora",
    read: false,
  },
  {
    id: 3,
    type: "update",
    text: "Nuevo servicio agregado: Corte de cabello",
    time: "Ayer",
    read: true,
  },
  {
    id: 4,
    type: "new",
    text: "Nueva cita agendada para el viernes",
    time: "Hace 2 horas",
    read: true,
  },
  {
    id: 5,
    type: "update",
    text: "Servicio de barba actualizado",
    time: "Ayer",
    read: true,
  },
  {
    id: 6,
    type: "cancel",
    text: "Cancelación de cita del sábado",
    time: "Hace 2 días",
    read: true,
  },
];

export default function Notifications() {
  const MAX_VISIBLE = 5;

  return (
    <section className="bg-barber-white rounded-2xl border border-barber-gray/30 p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-barber-black flex items-center gap-2">
          <Bell className="w-5 h-5 text-barber-gold" />
          Resumen del día
        </h2>
        <span className="text-sm text-barber-gray">Hoy</span>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryCard title="Citas hoy" value="5" />
        <SummaryCard title="Próximas" value="12" />
        <SummaryCard title="Cancelaciones" value="2" />
      </div>

      {/* NOTIFICATIONS */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
        {notifications.slice(0, MAX_VISIBLE).map((n) => (
          <NotificationItem key={n.id} data={n} />
        ))}
      </div>

      {/* VER MÁS */}
      {notifications.length > MAX_VISIBLE && (
        <button className="text-sm text-barber-gold font-semibold hover:underline">
          Ver todas las notificaciones
        </button>
      )}
    </section>
  );
}

function NotificationItem({ data }) {
  const styles = {
    new: `
      border-2 border-barber-info
      bg-barber-info/20
    `,
    cancel: `
      border-2 border-barber-wine
      bg-barber-wine/20
    `,
    update: `
      border-2 border-barber-gold
      bg-barber-gold/25
    `,
  };

  const icons = {
    new: CalendarPlus,
    cancel: XCircle,
    update: Sparkles,
  };

  const Icon = icons[data.type];

  return (
    <div
      className={`
        flex items-start gap-4
        p-4
        rounded-xl
        transition
        ${styles[data.type]}
        ${!data.read ? "ring-2 ring-barber-gold/40" : "opacity-90"}
      `}
    >
      {/* ICON */}
      <Icon className="w-6 h-6 stroke-[2.5]" />

      {/* CONTENT */}
      <div className="flex-1">
        <p className="text-sm font-medium text-barber-black">
          {data.text}
        </p>
        <span className="text-xs text-barber-gray">{data.time}</span>
      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="bg-barber-light rounded-xl p-4 border-2 border-barber-gold/40 text-center md:text-left">
      <p className="text-xs text-barber-gray">{title}</p>
      <p className="text-2xl font-bold text-barber-gold mt-1">{value}</p>
    </div>
  );
}
