import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const linkBase =
    "block px-4 py-2 rounded-lg transition font-medium";

  const linkActive =
    "bg-barber-light text-barber-black";

  const linkInactive =
    "text-barber-gray hover:bg-barber-light hover:text-barber-black";

  return (
    <aside className="w-64 bg-barber-white border-r border-barber-gray p-6 flex flex-col">
      {/* LOGO / TITLE */}
      <div>
        <h2 className="text-2xl font-bold text-barber-gold mb-8">
          Barber Admin
        </h2>

        {/* NAV */}
        <nav className="space-y-1 text-sm">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Notificaciones
          </NavLink>

          <NavLink
            to="/dashboard/services"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Servicios
          </NavLink>

          <NavLink
            to="/dashboard/appointments"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Citas
          </NavLink>

          <NavLink
            to="/dashboard/schedule"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Horarios
          </NavLink>
        </nav>
      </div>

      {/* LOGOUT BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="
          mt-auto
          flex items-center justify-center gap-2
          px-4 py-2
          rounded-lg
          border border-barber-wine
          text-barber-wine
          font-semibold
          hover:bg-barber-wine
          hover:text-white
          transition
        "
      >
        ⏻ Cerrar sesión
      </button>
    </aside>
  );
}
