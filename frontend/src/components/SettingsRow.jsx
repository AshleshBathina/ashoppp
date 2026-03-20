import { ChevronRight } from "lucide-react"

const SettingsRow = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-between w-full px-4 py-4 transition-colors hover:bg-[#2C2C2E] active:bg-[#2C2C2E] rounded-2xl"
  >
    <div className="flex items-center gap-3">
      <div className="text-white/70">{icon}</div>
      <span className="text-white text-sm font-medium">{label}</span>
    </div>
    <ChevronRight className="text-white/40 size-4" />
  </button>
)

export default SettingsRow