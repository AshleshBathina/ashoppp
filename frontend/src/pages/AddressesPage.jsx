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

import { AddressForm, DesktopAddressModal } from "../modals/AddressFormModal"
import { AddressCard, DesktopAddressCard } from "../components/AddressCard"

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


const FIELD_CONFIGS = [
  { key: "label", label: "Label", placeholder: "e.g., Home, Work, Office", type: "text" },
  { key: "fullName", label: "Full Name", placeholder: "Enter your full name", type: "text" },
  { key: "streetAddress", label: "Street Address", placeholder: "Street address, apt/suite number", type: "text" },
  { key: "city", label: "City", placeholder: "e.g., New York", type: "text" },
  { key: "state", label: "State", placeholder: "e.g., NY", type: "text" },
  { key: "zipCode", label: "ZIP Code", placeholder: "e.g., 10001", type: "text" },
  { key: "phoneNumber", label: "Phone Number", placeholder: "+1 (555) 123-4567", type: "tel" },
]



/*  main page  */

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
