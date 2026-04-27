import { Heart } from "lucide-react"
import { MobileWishlistCard, DesktopWishlistCard } from "../components/WishlistCard"
import useWishlist from "../hooks/useWishlist"
import useCart from "../hooks/useCart"

const WishlistPage = () => {
  const { wishlist, wishlistCount, isLoading, removeFromWishlist, isTogglePending } = useWishlist()
  const { toggleCart, isInCart, isAddingToCart, isRemovingFromCart } = useCart()

  const isCartBusy = isAddingToCart || isRemovingFromCart

  /* Loading skeleton */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F]">
        {/* Mobile */}
        <div className="md:hidden pt-7 px-4 space-y-3">
          <div className="h-7 w-32 bg-white/10 rounded-lg animate-pulse mb-8" />
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#1C1C1E] rounded-2xl p-4 flex gap-4 animate-pulse">
              <div className="size-24 rounded-xl bg-white/10 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-16 bg-white/10 rounded" />
                <div className="h-4 w-full bg-white/10 rounded" />
                <div className="h-3 w-24 bg-white/10 rounded" />
                <div className="h-8 w-full bg-white/10 rounded-xl mt-3" />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop */}
        <div className="hidden md:block px-10 py-8">
          <div className="h-9 w-48 bg-white/10 rounded-lg animate-pulse mb-8" />
          <div className="grid grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-[#161616] border border-[#222] rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-white/10" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-3 w-24 bg-white/10 rounded" />
                  <div className="h-8 w-full bg-white/10 rounded-xl mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0F0F0F]">

      {/* ══════════════ MOBILE LAYOUT ══════════════ */}
      <div className="md:hidden pt-7 pb-32">
        <div className="px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-white font-bold text-2xl">Wishlist</h1>
              <p className="text-neutral-500 text-xs mt-0.5">
                {wishlistCount === 0 ? "No saved items" : `${wishlistCount} saved item${wishlistCount !== 1 ? "s" : ""}`}
              </p>
            </div>
            {wishlistCount > 0 && (
              <span className="bg-green-600/20 text-green-400 border border-green-600/30 text-xs font-semibold px-3 py-1 rounded-full">
                {wishlistCount}
              </span>
            )}
          </div>

          {wishlist.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/5">
                <Heart className="size-10 text-white/20" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Your wishlist is empty</p>
                <p className="text-white/40 text-sm mt-1">Save items you love and shop them later</p>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {wishlist.map(product => (
                <MobileWishlistCard
                  key={product._id}
                  product={product}
                  onRemove={removeFromWishlist}
                  onCartToggle={toggleCart}
                  isInCart={isInCart(product._id)}
                  isPending={isTogglePending(product._id)}
                  isCartBusy={isCartBusy}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ══════════════ DESKTOP LAYOUT ══════════════ */}
      <div className="hidden md:flex flex-col min-h-screen">

        {/* Sticky header */}
        <header className="flex items-center justify-between px-10 py-5 border-b border-[#1A1A1A] bg-[#0F0F0F] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Heart className="size-6 text-red-400 fill-red-400" />
            <div>
              <h1 className="font-bold text-white text-2xl">My Wishlist</h1>
              <p className="text-[#6B7280] text-sm mt-0.5">
                {wishlistCount === 0
                  ? "No saved items yet"
                  : `${wishlistCount} saved item${wishlistCount !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 px-10 py-8">
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
              <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-[#161616] border border-[#222]">
                <Heart className="size-12 text-white/20" strokeWidth={1.2} />
              </div>
              <div>
                <p className="text-white font-bold text-2xl">Your wishlist is empty</p>
                <p className="text-white/40 text-base mt-2">Browse products and tap the heart to save your favourites</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[#555] text-[11px] uppercase tracking-widest font-semibold mb-4">
                Saved Items
              </p>
              <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {wishlist.map(product => (
                  <DesktopWishlistCard
                    key={product._id}
                    product={product}
                    onRemove={removeFromWishlist}
                    onCartToggle={toggleCart}
                    isInCart={isInCart(product._id)}
                    isPending={isTogglePending(product._id)}
                    isCartBusy={isCartBusy}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default WishlistPage
