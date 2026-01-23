import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-barber-light">
      <div className="bg-barber-white w-full max-w-sm rounded-2xl p-8 shadow-xl border border-barber-gray/30">

        {/* LOGO / TITLE */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-barber-gold">
            Barber Admin
          </h1>
          <p className="text-sm text-barber-gray mt-1">
            Panel de gestión
          </p>
        </div>

        {/* EMAIL */}
        <div className="relative mb-4">
          <Mail
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-barber-gray"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="
              w-full
              pl-10 pr-4 py-2.5
              rounded-lg
              border border-barber-gray/40
              text-barber-black
              focus:outline-none
              focus:ring-2
              focus:ring-barber-gold
              transition
            "
          />
        </div>

        {/* PASSWORD */}
        <div className="relative mb-6">
          <Lock
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-barber-gray"
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            className="
              w-full
              pl-10 pr-12 py-2.5
              rounded-lg
              border border-barber-gray/40
              text-barber-black
              focus:outline-none
              focus:ring-2
              focus:ring-barber-gold
              transition
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              text-barber-gray
              hover:text-barber-black
              transition
            "
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/dashboard")}
          className="
            w-full
            bg-barber-gold
            text-barber-black
            py-2.5
            rounded-lg
            font-semibold
            hover:bg-barber-info
            hover:text-white
            active:scale-[0.97]
            transition
          "
        >
          Iniciar sesión
        </button>

        {/* FOOTER */}
        <p className="text-xs text-barber-gray text-center mt-6">
          Acceso exclusivo para barberos
        </p>
      </div>
    </div>
  );
}
