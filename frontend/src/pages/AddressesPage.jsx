import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { userApi } from "../lib/api"
import { useNavigate } from "react-router"
import {
  ArrowLeft,
  MapPin,
  Plus,
  X,
  PenLine,
  Trash2,
  Home,
  Briefcase,
  Building2,
} from "lucide-react"

/* ─── helpers ─────────────────────────────────────────────── */

const LABEL_ICONS = {
  Home: <Home className="size-4" />,
  Work: <Briefcase className="size-4" />,
  Office: <Building2 className="size-4" />,
}

const getLabelIcon = (label = "") =>
  LABEL_ICONS[label] ?? <MapPin className="size-4" />

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

/* ─── AddressCard (mobile) ─────────────────────────────────── */

const AddressCard = ({ address, onEdit, onDelete, isDeleting }) => (
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

/* ─── AddressCard (desktop) ────────────────────────────────── */

const DesktopAddressCard = ({ address, onEdit, onDelete, isDeleting }) => (
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

/* ─── AddressForm (bottom sheet — mobile only) ─────────────── */

const FIELD_CONFIGS = [
  { key: "label", label: "Label", placeholder: "e.g., Home, Work, Office", type: "text" },
  { key: "fullName", label: "Full Name", placeholder: "Enter your full name", type: "text" },
  { key: "streetAddress", label: "Street Address", placeholder: "Street address, apt/suite number", type: "text" },
  { key: "city", label: "City", placeholder: "e.g., New York", type: "text" },
  { key: "state", label: "State", placeholder: "e.g., NY", type: "text" },
  { key: "zipCode", label: "ZIP Code", placeholder: "e.g., 10001", type: "text" },
  { key: "phoneNumber", label: "Phone Number", placeholder: "+1 (555) 123-4567", type: "tel" },
]

const AddressForm = ({ initial, onSave, onClose, isSaving }) => {
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

/* ─── DesktopAddressModal (desktop only) ──────────────────── */

const DesktopAddressModal = ({ initial, onSave, onClose, isSaving }) => {
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

/* ─── main page ──────────────────────────────────────────────── */

const AddressesPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)

  /* ── queries ── */
  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: userApi.getAddresses,
  })

  /* ── mutations ── */
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["addresses"] })

  const addMutation = useMutation({
    mutationFn: userApi.addAddress,
    onSuccess: () => { invalidate(); closeForm() },
  })

  const updateMutation = useMutation({
    mutationFn: userApi.updateAddress,
    onSuccess: () => { invalidate(); closeForm() },
  })

  const deleteMutation = useMutation({
    mutationFn: userApi.deleteAddress,
    onSuccess: invalidate,
  })

  /* ── handlers ── */
  const openAddForm = () => {
    setEditingAddress(null)
    setShowForm(true)
  }

  const openEditForm = (address) => {
    setEditingAddress(address)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingAddress(null)
  }

  const handleSave = (formData) => {
    if (editingAddress) {
      updateMutation.mutate({ addressId: editingAddress._id, ...formData })
    } else {
      addMutation.mutate(formData)
    }
  }

  const handleDelete = (addressId) => {
    if (window.confirm("Delete this address?")) {
      deleteMutation.mutate(addressId)
    }
  }

  const isSaving = addMutation.isPending || updateMutation.isPending

  const formInitial = editingAddress
    ? {
      label: editingAddress.label,
      fullName: editingAddress.fullName,
      streetAddress: editingAddress.streetAddress,
      city: editingAddress.city,
      state: editingAddress.state,
      zipCode: editingAddress.zipCode,
      phoneNumber: editingAddress.phoneNumber,
      isDefault: editingAddress.isDefault,
    }
    : null

  /* ── loading skeleton ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F]">
        {/* Mobile skeleton */}
        <div className="md:hidden pt-7 pb-28 px-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
            <div className="h-6 w-32 bg-white/10 rounded-lg animate-pulse" />
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="bg-[#1C1C1E] rounded-2xl p-4 mb-3 space-y-2 animate-pulse">
              <div className="h-4 w-24 bg-white/10 rounded" />
              <div className="h-3 w-40 bg-white/10 rounded" />
              <div className="h-3 w-32 bg-white/10 rounded" />
            </div>
          ))}
        </div>

        {/* Desktop skeleton */}
        <div className="hidden md:flex flex-col min-h-screen">
          <header className="flex items-center justify-between px-10 py-5 border-b border-[#1A1A1A]">
            <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-10 w-36 bg-white/10 rounded-xl animate-pulse" />
          </header>
          <div className="px-10 py-8">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#161616] border border-[#222] rounded-2xl p-5 space-y-3 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10" />
                    <div className="space-y-1">
                      <div className="h-4 w-20 bg-white/10 rounded" />
                      <div className="h-3 w-28 bg-white/10 rounded" />
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <div className="h-3 w-full bg-white/10 rounded" />
                    <div className="h-3 w-3/4 bg-white/10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">

      {/* ══════════════ MOBILE LAYOUT ══════════════ */}
      <div className="md:hidden pb-40 pt-7">
        <div className="px-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white"
            >
              <ArrowLeft className="size-5" />
            </button>
            <h1 className="text-white font-bold text-xl">My Addresses</h1>
          </div>

          {/* Empty State */}
          {addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/5">
                <MapPin className="size-10 text-white/25" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">No addresses yet</p>
                <p className="text-white/40 text-sm mt-1">Add your first delivery address</p>
              </div>
              <button
                onClick={openAddForm}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-3 rounded-full active:scale-95 transition-all"
              >
                Add Address
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
                <AddressCard
                  key={address._id}
                  address={address}
                  onEdit={openEditForm}
                  onDelete={handleDelete}
                  isDeleting={deleteMutation.isPending && deleteMutation.variables === address._id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Fixed bottom Add button */}
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-linear-to-t from-[#0F0F0F] via-[#0F0F0F]/90 to-transparent pointer-events-none">
          <button
            onClick={openAddForm}
            className="pointer-events-auto w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-2xl active:scale-95 transition-all shadow-xl shadow-green-900/30"
          >
            <Plus className="size-5" />
            Add New Address
          </button>
        </div>
      </div>

      {/* ══════════════ DESKTOP LAYOUT ══════════════ */}
      <div className="hidden md:flex flex-col min-h-screen">

        {/* Sticky header */}
        <header className="flex items-center justify-between px-10 py-5 border-b border-[#1A1A1A] bg-[#0F0F0F] sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-white/8 active:scale-95 transition-all text-white/60 hover:text-white"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <h1 className="font-bold text-white text-2xl">My Addresses</h1>
              <p className="text-[#6B7280] text-sm mt-0.5">
                {addresses.length === 0
                  ? "No saved addresses yet"
                  : `${addresses.length} saved address${addresses.length !== 1 ? "es" : ""}`}
              </p>
            </div>
          </div>
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl active:scale-95 transition-all"
          >
            <Plus className="size-4" />
            Add Address
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 px-10 py-8">
          {addresses.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
              <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-[#161616] border border-[#222]">
                <MapPin className="size-12 text-white/20" strokeWidth={1.2} />
              </div>
              <div>
                <p className="text-white font-bold text-2xl">No addresses saved</p>
                <p className="text-white/40 text-base mt-2">Add a delivery address to speed up checkout</p>
              </div>
              <button
                onClick={openAddForm}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-3 rounded-xl active:scale-95 transition-all text-sm"
              >
                <Plus className="size-4" />
                Add Your First Address
              </button>
            </div>
          ) : (
            <div>
              <p className="text-[#555] text-[11px] uppercase tracking-widest font-semibold mb-4">
                Saved Addresses
              </p>
              {/* 3-column grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <DesktopAddressCard
                    key={address._id}
                    address={address}
                    onEdit={openEditForm}
                    onDelete={handleDelete}
                    isDeleting={deleteMutation.isPending && deleteMutation.variables === address._id}
                  />
                ))}

                {/* Add new address card */}
                <button
                  onClick={openAddForm}
                  className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/10 hover:border-green-600/50 hover:bg-green-600/5 rounded-2xl py-8 text-white/30 hover:text-green-500 transition-all active:scale-95 group min-h-45"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl border border-current transition-colors">
                    <Plus className="size-5" />
                  </div>
                  <span className="text-sm font-semibold">Add New Address</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════ MODALS ══════════════ */}

      {/* Mobile: bottom sheet */}
      {showForm && (
        <div className="md:hidden">
          <AddressForm
            initial={formInitial}
            onSave={handleSave}
            onClose={closeForm}
            isSaving={isSaving}
          />
        </div>
      )}

      {/* Desktop: centered modal */}
      {showForm && (
        <div className="hidden md:block">
          <DesktopAddressModal
            initial={formInitial}
            onSave={handleSave}
            onClose={closeForm}
            isSaving={isSaving}
          />
        </div>
      )}
    </div>
  )
}

export default AddressesPage
