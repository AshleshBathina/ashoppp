import { Heart, ShoppingCart, Trash2, Plus, Check, LoaderIcon, Star } from "lucide-react"
import { useNavigate } from "react-router"

/* ─── Mobile card ─────────────────────────────────────────── */
export const MobileWishlistCard = ({ product, onRemove, onCartToggle, isInCart, isPending, isCartBusy }) => {
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
export const DesktopWishlistCard = ({ product, onRemove, onCartToggle, isInCart, isPending, isCartBusy }) => {
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