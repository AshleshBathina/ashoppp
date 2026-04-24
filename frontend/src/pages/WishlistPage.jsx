import { Heart, ShoppingCart, Trash2, Plus, Check, LoaderIcon, Star } from "lucide-react"
import { useNavigate } from "react-router"
import useWishlist from "../hooks/useWishlist"
import useCart from "../hooks/useCart"

/* ─── Mobile card ─────────────────────────────────────────── */
const MobileWishlistCard = ({ product, onRemove, onCartToggle, isInCart, isPending, isCartBusy }) => {
  const navigate = useNavigate()
  return (
    <li className="bg-[#1C1C1E] rounded-2xl p-4 flex gap-4 items-start">
      {/* Image */}
      <div
        className="relative size-24 shrink-0 rounded-xl overflow-hidden cursor-pointer"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-neutral-400 text-[10px] uppercase tracking-wide mb-0.5">{product.category}</p>
        <h2
          className="text-white text-sm font-semibold line-clamp-2 leading-snug cursor-pointer"
          onClick={() => navigate(`/product/${product._id}`)}
        >
          {product.name}
        </h2>
        <p className="flex items-center gap-1 text-[11px] text-neutral-400 mt-1">
          <Star className="fill-amber-300 size-3 text-amber-400" />
          <span className="text-white">{product.averageRating}</span>
          <span>{`(${product.totalReviews})`}</span>
        </p>
        <p className="text-green-400 font-bold text-base mt-1.5">₹{product.price}</p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => onCartToggle(product._id)}
            disabled={isCartBusy}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 cursor-pointer
            ${isInCart
                ? "bg-green-500/15 text-green-400 border border-green-500/30"
                : "bg-green-600 hover:bg-green-500 text-white"}`}
          >
            {isInCart ? <><Check className="size-3.5" />In Cart</> : <><ShoppingCart className="size-3.5" />Add to Cart</>}
          </button>
          <button
            onClick={() => onRemove(product._id)}
            disabled={isPending}
            className="p-2 rounded-xl bg-red-900/20 hover:bg-red-900/40 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isPending
              ? <LoaderIcon className="size-4 text-red-400 animate-spin" />
              : <Trash2 className="size-4 text-red-400" />}
          </button>
        </div>
      </div>
    </li>
  )
}

/* ─── Desktop card ────────────────────────────────────────── */
const DesktopWishlistCard = ({ product, onRemove, onCartToggle, isInCart, isPending, isCartBusy }) => {
  const navigate = useNavigate()
  return (
    <li className="group bg-[#161616] border border-[#222222] hover:border-green-500/20 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40 flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product._id}`)}>
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

        {/* Remove button */}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(product._id) }}
          disabled={isPending}
          className="absolute top-3 cursor-pointer right-3 size-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-red-900/60 transition-colors disabled:opacity-60"
        >
          {isPending
            ? <LoaderIcon className="size-4 text-white animate-spin" />
            : <Heart className="size-4 fill-red-400 text-red-400" />}
        </button>

        {/* Category badge */}
        <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-[10px] text-neutral-300 px-2 py-0.5 rounded-full">
          {product.category}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 cursor-pointer" onClick={() => navigate(`/product/${product._id}`)}>
        <h2 className="line-clamp-2 text-sm font-medium text-white leading-snug mb-1.5">{product.name}</h2>
        <p className="flex gap-1 items-center text-[11px] text-neutral-400 mb-3">
          <Star className="fill-amber-300 size-3 text-amber-400" />
          <span className="text-white">{product.averageRating}</span>
          <span>{`(${product.totalReviews} reviews)`}</span>
        </p>

        <div className="mt-auto flex items-center justify-between gap-3">
          <p className="text-green-400 font-bold text-base">₹{product.price}</p>
          <button
            onClick={(e) => { e.stopPropagation(); onCartToggle(product._id) }}
            disabled={isCartBusy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer duration-200 active:scale-95 disabled:opacity-50
            ${isInCart
                ? "bg-green-500/15 text-green-400 border border-green-500/30"
                : "bg-green-600 hover:bg-green-500 text-white"}`}
          >
            {isInCart ? <><Check className="size-3.5" />Added</> : <><Plus className="size-3.5" />Add to Cart</>}
          </button>
        </div>
      </div>
    </li>
  )
}

/* ─── Main page ───────────────────────────────────────────── */
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
