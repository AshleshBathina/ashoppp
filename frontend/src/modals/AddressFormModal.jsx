import { useState } from "react"
import { X } from "lucide-react"

const EMPTY_FORM = {
  label: "",
  fullName: "",
  streetAddress: "",
  city: "",
  state: "",
  zipCode: "",
  phoneNumber: "",
  isDefault: false,
}

const FIELD_CONFIGS = [
  { key: "label", label: "Label", placeholder: "e.g., Home, Work, Office", type: "text" },
  { key: "fullName", label: "Full Name", placeholder: "Enter your full name", type: "text" },
  { key: "streetAddress", label: "Street Address", placeholder: "Street address, apt/suite number", type: "text" },
  { key: "city", label: "City", placeholder: "e.g., New York", type: "text" },
  { key: "state", label: "State", placeholder: "e.g., NY", type: "text" },
  { key: "zipCode", label: "ZIP Code", placeholder: "e.g., 10001", type: "text" },
  { key: "phoneNumber", label: "Phone Number", placeholder: "+1 (555) 123-4567", type: "tel" },
]

export const DesktopAddressModal = ({ initial, onSave, onClose, isSaving }) => {
  const [form, setForm] = useState(initial ?? EMPTY_FORM)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  // Split fields: first two in their own row, then pairs
  const topFields = FIELD_CONFIGS.slice(0, 2)           // label, fullName
  const streetField = FIELD_CONFIGS[2]                  // streetAddress (full width)
  const pairFields = FIELD_CONFIGS.slice(3, 6)          // city, state, zip
  const phoneField = FIELD_CONFIGS[6]                   // phoneNumber (full width)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal panel */}
      <div className="relative w-full max-w-2xl bg-[#161616] border border-[#252525] rounded-2xl z-10 overflow-hidden shadow-2xl shadow-black/60">

        {/* Modal header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#222]">
          <div>
            <h2 className="text-white font-bold text-xl">
              {initial ? "Edit Address" : "Add New Address"}
            </h2>
            <p className="text-white/40 text-sm mt-0.5">
              {initial ? "Update your saved address details" : "Save a new delivery address to your account"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-xl text-white/50 hover:text-white hover:bg-white/8 transition-all"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal body */}
        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5 max-h-[70vh] overflow-y-auto">

          {/* Row 1: Label + Full Name */}
          <div className="grid grid-cols-2 gap-4">
            {topFields.map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wide mb-2">
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder={placeholder}
                  required
                  className="w-full bg-[#1C1C1E] border border-[#2A2A2A] text-white placeholder-white/25 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                />
              </div>
            ))}
          </div>

          {/* Row 2: Street Address (full width) */}
          <div>
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wide mb-2">
              {streetField.label}
            </label>
            <input
              type={streetField.type}
              value={form[streetField.key]}
              onChange={(e) => set(streetField.key, e.target.value)}
              placeholder={streetField.placeholder}
              required
              className="w-full bg-[#1C1C1E] border border-[#2A2A2A] text-white placeholder-white/25 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
            />
          </div>

          {/* Row 3: City / State / ZIP */}
          <div className="grid grid-cols-3 gap-4">
            {pairFields.map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wide mb-2">
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder={placeholder}
                  required
                  className="w-full bg-[#1C1C1E] border border-[#2A2A2A] text-white placeholder-white/25 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                />
              </div>
            ))}
          </div>

          {/* Row 4: Phone (full width) */}
          <div>
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wide mb-2">
              {phoneField.label}
            </label>
            <input
              type={phoneField.type}
              value={form[phoneField.key]}
              onChange={(e) => set(phoneField.key, e.target.value)}
              placeholder={phoneField.placeholder}
              required
              className="w-full bg-[#1C1C1E] border border-[#2A2A2A] text-white placeholder-white/25 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
            />
          </div>

          {/* Default toggle */}
          <div className="flex items-center justify-between py-3 px-4 bg-[#1C1C1E] border border-[#2A2A2A] rounded-xl">
            <div>
              <p className="text-white/85 text-sm font-medium">Set as default address</p>
              <p className="text-white/35 text-xs mt-0.5">Used automatically at checkout</p>
            </div>
            <button
              type="button"
              onClick={() => set("isDefault", !form.isDefault)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${form.isDefault ? "bg-green-600" : "bg-white/15"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.isDefault ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>
        </form>

        {/* Modal footer */}
        <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-[#222] bg-[#111]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#333] text-white/60 text-sm font-semibold hover:bg-white/5 hover:text-white active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-500 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
          >
            {isSaving ? "Saving…" : "Save Address"}
          </button>
        </div>
      </div>
    </div>
  )
}

export const AddressForm = ({ initial, onSave, onClose, isSaving }) => {
  const [form, setForm] = useState(initial ?? EMPTY_FORM)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Bottom sheet */}
      <div className="relative w-full bg-[#1C1C1E] rounded-t-3xl p-6 z-10 max-h-[92dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">
            {initial ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {FIELD_CONFIGS.map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className="block text-white/70 text-sm mb-1.5 font-medium">
                {label}
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                required
                className="w-full bg-[#2C2C2E] text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
              />
            </div>
          ))}

          {/* Default toggle */}
          <div className="flex items-center justify-between py-2">
            <span className="text-white/80 text-sm font-medium">
              Set as default address
            </span>
            <button
              type="button"
              onClick={() => set("isDefault", !form.isDefault)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isDefault ? "bg-green-600" : "bg-white/20"
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.isDefault ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/20 text-white/70 text-sm font-semibold hover:bg-white/5 active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-500 active:scale-95 transition-all disabled:opacity-60"
            >
              {isSaving ? "Saving…" : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}