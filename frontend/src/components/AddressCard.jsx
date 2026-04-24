import { MapPin, PenLine, Trash2, Home, Briefcase, Building2 } from "lucide-react"

const LABEL_ICONS = {
  Home: <Home className="size-4" />,
  Work: <Briefcase className="size-4" />,
  Office: <Building2 className="size-4" />,
}

const getLabelIcon = (label = "") =>
  LABEL_ICONS[label] ?? <MapPin className="size-4" />

export const AddressCard = ({ address, onEdit, onDelete, isDeleting }) => (
  <div className="bg-[#1C1C1E] rounded-2xl p-4 space-y-3">
    {/* Header row */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-600/20 text-green-500">
          {getLabelIcon(address.label)}
        </div>
        <span className="text-white font-semibold text-base">{address.label}</span>
      </div>
      {address.isDefault && (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-600 text-white">
          Default
        </span>
      )}
    </div>

    {/* Address details */}
    <div className="space-y-0.5 text-sm text-white/60">
      <p className="text-white/90 font-medium">{address.fullName}</p>
      <p>{address.streetAddress}</p>
      <p>
        {address.city}, {address.state} {address.zipCode}
      </p>
      <p>{address.phoneNumber}</p>
    </div>

    {/* Action buttons */}
    <div className="grid grid-cols-2 gap-2 pt-1">
      <button
        onClick={() => onEdit(address)}
        className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-green-600 text-green-500 text-sm font-semibold hover:bg-green-600/10 active:scale-95 transition-all"
      >
        <PenLine className="size-3.5" />
        Edit
      </button>
      <button
        onClick={() => onDelete(address._id)}
        disabled={isDeleting}
        className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-700 text-red-500 text-sm font-semibold hover:bg-red-900/20 active:scale-95 transition-all disabled:opacity-50"
      >
        <Trash2 className="size-3.5" />
        Delete
      </button>
    </div>
  </div>
)

export const DesktopAddressCard = ({ address, onEdit, onDelete, isDeleting }) => (
  <div className="group bg-[#161616] border border-[#222222] hover:border-[#333] rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200">
    {/* Header */}
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-600/15 text-green-500 shrink-0">
          {getLabelIcon(address.label)}
        </div>
        <div>
          <span className="text-white font-semibold text-base leading-tight block">{address.label}</span>
          <span className="text-white/40 text-xs">{address.fullName}</span>
        </div>
      </div>
      {address.isDefault && (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-600/20 text-green-400 border border-green-600/30 shrink-0">
          Default
        </span>
      )}
    </div>

    {/* Address details */}
    <div className="space-y-1 text-sm text-white/55 border-t border-white/5 pt-3">
      <p>{address.streetAddress}</p>
      <p>{address.city}, {address.state} {address.zipCode}</p>
      <p className="text-white/40 text-xs pt-0.5">{address.phoneNumber}</p>
    </div>

    {/* Action buttons */}
    <div className="flex gap-2 pt-1">
      <button
        onClick={() => onEdit(address)}
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:border-green-600/50 hover:text-green-400 hover:bg-green-600/5 active:scale-95 transition-all"
      >
        <PenLine className="size-3.5" />
        Edit
      </button>
      <button
        onClick={() => onDelete(address._id)}
        disabled={isDeleting}
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:border-red-700/50 hover:text-red-400 hover:bg-red-900/10 active:scale-95 transition-all disabled:opacity-50"
      >
        <Trash2 className="size-3.5" />
        Delete
      </button>
    </div>
  </div>
)