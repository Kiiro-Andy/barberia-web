export default function TopBar() {
  return (
    <header
      className="
        h-16
        bg-barber-white
        border-b border-barber-gray/20
        px-6
        flex items-center justify-between
      "
    >
      {/* LEFT: TITLE */}
      <div>
        <h1 className="text-lg font-bold text-barber-black">
          Panel Barbero
        </h1>
        <p className="text-xs text-barber-gray">
          Administrativo
        </p>
      </div>

      {/* RIGHT: USER */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-barber-gray">
          Barbero
        </span>

        <div
          className="
            w-9 h-9
            rounded-full
            bg-barber-gold
            text-barber-black
            flex items-center justify-center
            font-bold
            shadow-sm
          "
        >
          B
        </div>
      </div>
    </header>
  );
}
