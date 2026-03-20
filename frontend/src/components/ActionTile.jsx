const ActionTile = ({ icon, label, accent, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-[#1C1C1E] p-5 transition-colors hover:bg-[#2C2C2E] active:scale-95 w-full aspect-square"
  >
    <div
      className="flex items-center justify-center rounded-2xl p-3"
      style={{ backgroundColor: accent + "22" }}
    >
      {icon}
    </div>
    <span className="text-sm font-medium text-white">{label}</span>
  </button>
)

export default ActionTile