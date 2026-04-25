import { UserButton } from "@clerk/clerk-react"
import { useLocation } from "react-router"

import { ClipboardListIcon, HomeIcon, PanelLeftIcon, ShoppingBagIcon, UsersIcon, Sparkles } from "lucide-react"

export const NAVIGATION = [
  { name: "Dashboard", path: "/dashboard", icon: <HomeIcon className="size-5" /> },
  { name: "Products", path: "/products", icon: <ShoppingBagIcon className="size-5" /> },
  { name: "Orders", path: "/orders", icon: <ClipboardListIcon className="size-5" /> },
  { name: "Customers", path: "/customers", icon: <UsersIcon className="size-5" /> },
  { name: "Interests", path: "/interests", icon: <Sparkles className="size-5" /> },
]

function Navbar() {
  const location = useLocation();

  return (
    <div className="navbar w-full bg-base-300">
      <label htmlFor="my-drawer" className="btn, btn-square btn-ghost">
        <PanelLeftIcon className="size-5" />
      </label>

      <div className="flex-1 px-4">
        <h1 className="text-xl font-bold">
          {NAVIGATION.find(item => location.pathname === item.path)?.name || "Dashboard"}
        </h1>
      </div>

      <div className="mr-5">
        <UserButton />
      </div>
    </div>
  )
}

export default Navbar