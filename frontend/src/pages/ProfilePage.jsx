import { useUser, useClerk } from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query"
import { ordersApi, userApi } from "../lib/api"
import {
  User,
  ListOrdered,
  MapPin,
  Heart,
  Bell,
  ShieldCheck,
  LogOut,
  ChevronRight,
  CheckCircle2,
} from "lucide-react"
import { useNavigate } from "react-router"

/* ─── tiny helpers ─────────────────────────────────────────── */

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

/* ─── sub-components ────────────────────────────────────────── */

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

/* ─── main component ─────────────────────────────────────────── */

const ProfilePage = () => {
  const { user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: ordersApi.getUserOrders,
  })

  const { data: addresses = [] } = useQuery({
    queryKey: ["addresses"],
    queryFn: userApi.getAddresses,
  })

  const { data: wishlist = [] } = useQuery({
    queryKey: ["wishlist"],
    queryFn: userApi.getWishlist,
  })

  const fullName = user?.fullName || "User"
  const email = user?.primaryEmailAddress?.emailAddress || ""
  const initials = getInitials(fullName)
  const avatarUrl = user?.imageUrl

  const handleSignOut = () => signOut(() => navigate("/login"))

  const actionTiles = [
    {
      icon: <User className="size-6" style={{ color: "#6C8EEF" }} />,
      label: "Edit Profile",
      accent: "#6C8EEF",
      onClick: () => { },
    },
    {
      icon: <ListOrdered className="size-6" style={{ color: "#34C759" }} />,
      label: `Orders${orders.length ? ` (${orders.length})` : ""}`,
      accent: "#34C759",
      onClick: () => { },
    },
    {
      icon: <MapPin className="size-6" style={{ color: "#FF9F0A" }} />,
      label: `Addresses${addresses.length ? ` (${addresses.length})` : ""}`,
      accent: "#FF9F0A",
      onClick: () => navigate("/addresses"),
    },
    {
      icon: <Heart className="size-6" style={{ color: "#FF375F" }} />,
      label: `Wishlist${wishlist.length ? ` (${wishlist.length})` : ""}`,
      accent: "#FF375F",
      onClick: () => { },
    },
  ]

  const settingsRows = [
    { icon: <Bell className="size-5" />, label: "Notifications", onClick: () => { } },
    { icon: <ShieldCheck className="size-5" />, label: "Privacy & Security", onClick: () => { } },
  ]

  return (
    <div className="min-h-screen bg-[#0F0F0F]">

      {/* ══════════════ MOBILE LAYOUT ══════════════ */}
      <div className="md:hidden pt-7 pb-28 px-4 space-y-4">

        {/* Profile card */}
        <div className="bg-[#1C1C1E] rounded-3xl p-5 flex items-center gap-4">
          <div className="relative flex-shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={fullName} className="size-16 rounded-full object-cover" />
            ) : (
              <div className="size-16 rounded-full bg-[#2C5282] flex items-center justify-center">
                <span className="text-white font-bold text-xl">{initials}</span>
              </div>
            )}
            <span className="absolute bottom-0 right-0 bg-green-500 rounded-full p-0.5">
              <CheckCircle2 className="size-3.5 text-white fill-green-500" />
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-white font-semibold text-lg leading-tight truncate">{fullName}</h1>
            <p className="text-white/50 text-sm truncate">{email}</p>
          </div>
        </div>

        {/* 2×2 Action grid */}
        <div className="grid grid-cols-2 gap-3">
          {actionTiles.map((tile) => (
            <ActionTile key={tile.label} {...tile} />
          ))}
        </div>

        {/* Settings rows */}
        <div className="bg-[#1C1C1E] rounded-3xl divide-y divide-white/5 px-1">
          {settingsRows.map((row) => (
            <SettingsRow key={row.label} {...row} />
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 bg-[#1C1C1E] border border-red-800/40 text-red-500 font-semibold py-4 rounded-2xl hover:bg-red-900/20 transition-colors active:scale-95"
        >
          <LogOut className="size-5" />
          Sign Out
        </button>
      </div>

      {/* ══════════════ DESKTOP LAYOUT ══════════════ */}
      <div className="hidden md:flex flex-col min-h-screen">

        {/* Sticky header */}
        <header className="flex items-center justify-between px-10 py-5 border-b border-[#1A1A1A] bg-[#0F0F0F] sticky top-0 z-10">
          <div>
            <h1 className="font-bold text-white text-3xl">My Profile</h1>
            <p className="text-[#6B7280] text-sm mt-0.5">Manage your account and preferences</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 border border-red-800/40 text-red-400 font-semibold px-5 py-2.5 rounded-xl hover:bg-red-900/20 transition-colors text-sm"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </header>

        {/* Two-column body */}
        <div className="flex flex-1 gap-8 px-10 py-8 items-start">

          {/* ── Left column: profile card + action tiles ── */}
          <div className="flex flex-col gap-6 w-72 shrink-0 sticky top-24">

            {/* Profile card */}
            <div className="bg-[#161616] border border-[#222222] rounded-2xl p-6 flex flex-col items-center gap-3 text-center">
              <div className="relative">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName} className="size-20 rounded-full object-cover" />
                ) : (
                  <div className="size-20 rounded-full bg-[#2C5282] flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">{initials}</span>
                  </div>
                )}
                <span className="absolute bottom-0.5 right-0.5 bg-green-500 rounded-full p-0.5">
                  <CheckCircle2 className="size-4 text-white fill-green-500" />
                </span>
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg leading-tight">{fullName}</h2>
                <p className="text-white/40 text-sm mt-0.5">{email}</p>
              </div>
              <div className="flex gap-4 pt-1 w-full border-t border-white/5 mt-1">
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-white font-bold text-lg">{orders.length}</span>
                  <span className="text-white/40 text-xs">Orders</span>
                </div>
                <div className="w-px bg-white/5" />
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-white font-bold text-lg">{wishlist.length}</span>
                  <span className="text-white/40 text-xs">Wishlist</span>
                </div>
                <div className="w-px bg-white/5" />
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-white font-bold text-lg">{addresses.length}</span>
                  <span className="text-white/40 text-xs">Addresses</span>
                </div>
              </div>
            </div>

            {/* Quick stats / action tiles as a 2×2 grid */}
            <div>
              <p className="text-[#555] text-[11px] uppercase tracking-widest font-semibold mb-3">Quick Access</p>
              <div className="grid grid-cols-2 gap-3">
                {actionTiles.map((tile) => (
                  <ActionTile key={tile.label} {...tile} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column: settings + account ── */}
          <div className="flex-1 flex flex-col gap-6">

            {/* Settings section */}
            <div>
              <p className="text-[#555] text-[11px] uppercase tracking-widest font-semibold mb-3">Settings</p>
              <div className="bg-[#161616] border border-[#222222] rounded-2xl divide-y divide-white/5 px-1">
                {settingsRows.map((row) => (
                  <SettingsRow key={row.label} {...row} />
                ))}
              </div>
            </div>

            {/* Account section */}
            <div>
              <p className="text-[#555] text-[11px] uppercase tracking-widest font-semibold mb-3">Account</p>
              <div className="bg-[#161616] border border-[#222222] rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <p className="text-white/40 text-xs mb-0.5">Full Name</p>
                    <p className="text-white text-sm font-medium">{fullName}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-white/40 text-xs mb-0.5">Email</p>
                    <p className="text-white text-sm font-medium truncate">{email}</p>
                  </div>
                </div>
                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">Account Status</p>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-green-400 fill-green-400" />
                      <span className="text-green-400 text-sm font-medium">Verified</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 border border-[#333] text-white/70 text-sm px-4 py-2 rounded-xl hover:bg-[#222] transition-colors">
                    <User className="size-4" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default ProfilePage