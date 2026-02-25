export default function TopBar() {
  return (
    <header
      className="
        h-14 md:h-16
        bg-barber-white
        border-b border-barber-gray/20
        px-4 md:px-6
        flex items-center justify-between
      "
    >
      {/* LEFT */}
      <div className="ml-10 md:ml-0">
        <h1 className="text-base md:text-lg font-bold text-barber-black">
          Panel Barbero
        </h1>
        <p className="text-[10px] md:text-xs text-barber-gray">
          Administrativo
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 md:gap-3">
        <span className="hidden sm:block text-sm font-medium text-barber-gray">
          Barbero
        </span>

        <div
          className="
            w-8 h-8 md:w-9 md:h-9
            rounded-full
            bg-barber-gold
            text-barber-black
            flex items-center justify-center
            font-bold
            text-sm
            shadow-sm
          "
        >
          B
        </div>
      </div>
    </header>
  );
}
