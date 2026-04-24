import { useState } from "react"
import { useParams, useNavigate } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { productsApi } from "../lib/api"
import useCart from "../hooks/useCart"
import useWishlist from "../hooks/useWishlist"
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingCart,
  Check,
  Plus,
  Minus,
  Package,
  Tag,
  LoaderIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

/* ─── Star renderer ─────────────────────────────────────── */
const StarRating = ({ rating, size = "size-4" }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        className={`${size} ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-white/10 text-white/20"}`}
      />
    ))}
  </div>
)

/* ─── Image carousel (shared) ─────────────────────────── */
const ImageCarousel = ({ images, productName }) => {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(c => (c === 0 ? images.length - 1 : c - 1))
  const next = () => setCurrent(c => (c === images.length - 1 ? 0 : c + 1))

  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#1A1A1A] group">
      <img
        key={current}
        src={images[current]}
        alt={`${productName} ${current + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 cursor-pointer"
          >
            <ChevronLeft className="size-5 text-white" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 cursor-pointer"
          >
            <ChevronRight className="size-5 text-white" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all cursor-pointer ${i === current ? "w-5 h-2 bg-white" : "size-2 bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ─── Loading skeleton ─────────────────────────────────── */
const ProductDetailSkeleton = () => (
  <div className="min-h-screen bg-[#0F0F0F] animate-pulse">
    {/* Mobile */}
    <div className="md:hidden pt-7">
      <div className="px-4">
        <div className="w-8 h-8 rounded-full bg-white/10 mb-6" />
        <div className="w-full aspect-square rounded-2xl bg-white/10 mb-6" />
        <div className="space-y-3">
          <div className="h-3 w-20 bg-white/10 rounded" />
          <div className="h-6 w-3/4 bg-white/10 rounded" />
          <div className="h-4 w-32 bg-white/10 rounded" />
          <div className="h-8 w-24 bg-white/10 rounded" />
          <div className="space-y-2 mt-4">
            <div className="h-3 w-full bg-white/10 rounded" />
            <div className="h-3 w-5/6 bg-white/10 rounded" />
            <div className="h-3 w-4/6 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    </div>
    {/* Desktop */}
    <div className="hidden md:block px-10 py-8">
      <div className="w-20 h-6 bg-white/10 rounded mb-8" />
      <div className="grid grid-cols-2 gap-12">
        <div className="aspect-square rounded-2xl bg-white/10" />
        <div className="space-y-4">
          <div className="h-4 w-24 bg-white/10 rounded" />
          <div className="h-10 w-3/4 bg-white/10 rounded" />
          <div className="h-4 w-40 bg-white/10 rounded" />
          <div className="h-12 w-32 bg-white/10 rounded" />
          <div className="h-32 w-full bg-white/10 rounded" />
          <div className="flex gap-3">
            <div className="h-12 flex-1 bg-white/10 rounded-xl" />
            <div className="h-12 w-12 bg-white/10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
)

/* ─── Main page ─────────────────────────────────────────── */
const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [quantity, setQuantity] = useState(1)

  const { isInCart, addToCart, updateCartItem, isAddingToCart } = useCart()
  const { isInWishlist, toggleWishlist, isTogglePending } = useWishlist()

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getProductById(id),
    enabled: !!id,
  })

  if (isLoading) return <ProductDetailSkeleton />

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center gap-4">
        <Package className="size-16 text-white/20" strokeWidth={1} />
        <p className="text-white/50 text-lg">Product not found</p>
        <button onClick={() => navigate(-1)} className="text-green-400 text-sm hover:underline">
          Go back
        </button>
      </div>
    )
  }

  const inCart = isInCart(product._id)
  const inWishlist = isInWishlist(product._id)
  const wishlistPending = isTogglePending(product._id)
  const outOfStock = product.stock === 0

  const handleAddToCart = () => {
    if (inCart) {
      updateCartItem({ productId: product._id, quantity })
    } else {
      addToCart(product._id)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">

      {/* ══════════════ MOBILE LAYOUT ══════════════ */}
      <div className="md:hidden pb-40">
        <div className="px-4 pt-7">

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white mb-5"
          >
            <ArrowLeft className="size-5" />
          </button>

          {/* Image carousel */}
          <ImageCarousel images={product.images} productName={product.name} />

          {/* Details */}
          <div className="mt-5 space-y-4">
            {/* Category + wishlist row */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-neutral-500 font-semibold">
                <Tag className="size-3" />
                {product.category}
              </span>
              <button
                onClick={() => toggleWishlist(product._id)}
                disabled={wishlistPending}
                className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {wishlistPending
                  ? <LoaderIcon className="size-5 text-white animate-spin" />
                  : <Heart className={`size-5 ${inWishlist ? "fill-red-400 text-red-400" : "text-white/60"}`} />}
              </button>
            </div>

            {/* Name */}
            <h1 className="text-white font-bold text-xl leading-snug">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <StarRating rating={product.averageRating} />
              <span className="text-white text-sm font-medium">{product.averageRating.toFixed(1)}</span>
              <span className="text-neutral-500 text-sm">({product.totalReviews} reviews)</span>
            </div>

            {/* Price + stock */}
            <div className="flex items-center justify-between">
              <p className="text-green-400 font-bold text-3xl">₹{product.price}</p>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${outOfStock ? "bg-red-900/30 text-red-400" : "bg-green-900/30 text-green-400"}`}>
                {outOfStock ? "Out of stock" : `${product.stock} in stock`}
              </span>
            </div>

            {/* Description */}
            <div className="bg-[#1C1C1E] rounded-2xl p-4">
              <p className="text-neutral-500 text-xs uppercase tracking-wide font-semibold mb-2">Description</p>
              <p className="text-white/70 text-sm leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Fixed bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-4 bg-linear-to-t from-[#0F0F0F] via-[#0F0F0F]/95 to-transparent">
          <div className="flex items-center gap-3">
            {/* Quantity stepper */}
            <div className="flex items-center gap-3 bg-[#1C1C1E] rounded-xl px-3 py-2.5">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="text-white/60 hover:text-white active:scale-90 transition-all cursor-pointer"
              >
                <Minus className="size-4" />
              </button>
              <span className="text-white font-bold text-base w-5 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                disabled={outOfStock}
                className="text-white/60 hover:text-white active:scale-90 transition-all disabled:opacity-30 cursor-pointer"
              >
                <Plus className="size-4" />
              </button>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={outOfStock || isAddingToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer
                ${inCart ? "bg-green-500/15 text-green-400 border border-green-500/30" : "bg-green-600 hover:bg-green-500 text-white shadow-xl shadow-green-900/30"}`}
            >
              {isAddingToCart
                ? <LoaderIcon className="size-4 animate-spin" />
                : inCart
                  ? <><Check className="size-4" />In Cart</>
                  : <><ShoppingCart className="size-4" />Add to Cart</>}
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════ DESKTOP LAYOUT ══════════════ */}
      <div className="hidden md:block">

        {/* Sticky header */}
        <header className="flex items-center gap-4 px-10 py-5 border-b border-[#1A1A1A] bg-[#0F0F0F] sticky top-0 z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-white/8 active:scale-95 transition-all text-white/60 hover:text-white"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <p className="text-white/40 text-xs">{product.category}</p>
            <h1 className="text-white font-bold text-base leading-tight line-clamp-1">{product.name}</h1>
          </div>
        </header>

        {/* Two-column content */}
        <div className="px-10 py-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-14 items-start">

            {/* Left: image carousel */}
            <div className="sticky top-24">
              <ImageCarousel images={product.images} productName={product.name} />

              {/* Thumbnail strip */}
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      className="size-16 rounded-xl object-cover shrink-0 border-2 border-transparent opacity-60 hover:opacity-100 cursor-pointer transition-opacity"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right: details */}
            <div className="space-y-6">
              {/* Category badge */}
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-green-500 font-semibold bg-green-500/10 px-3 py-1 rounded-full">
                <Tag className="size-3" />
                {product.category}
              </span>

              {/* Name */}
              <h2 className="text-white font-bold text-3xl leading-tight">{product.name}</h2>

              {/* Rating row */}
              <div className="flex items-center gap-3">
                <StarRating rating={product.averageRating} size="size-4.5" />
                <span className="text-white font-semibold">{product.averageRating.toFixed(1)}</span>
                <span className="text-neutral-500 text-sm">{product.totalReviews} reviews</span>
                <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${outOfStock ? "bg-red-900/30 text-red-400" : "bg-green-900/20 text-green-400"}`}>
                  {outOfStock ? "Out of stock" : `${product.stock} in stock`}
                </span>
              </div>

              {/* Price */}
              <p className="text-green-400 font-bold text-4xl">₹{product.price}</p>

              {/* Description */}
              <div className="bg-[#161616] border border-[#222] rounded-2xl p-5">
                <p className="text-neutral-500 text-xs uppercase tracking-wide font-semibold mb-3">About this product</p>
                <p className="text-white/65 text-sm leading-relaxed">{product.description}</p>
              </div>

              {/* Quantity + actions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <p className="text-white/50 text-sm">Quantity</p>
                  <div className="flex items-center gap-3 bg-[#1C1C1E] border border-[#2A2A2A] rounded-xl px-4 py-2">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="text-white/60 hover:text-white active:scale-90 transition-all cursor-pointer"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="text-white font-bold text-base w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      disabled={outOfStock}
                      className="text-white/60 hover:text-white active:scale-90 transition-all disabled:opacity-30 cursor-pointer"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  {/* Add to cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={outOfStock || isAddingToCart}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer
                      ${inCart ? "bg-green-500/15 text-green-400 border border-green-500/30" : "bg-green-600 hover:bg-green-500 text-white"}`}
                  >
                    {isAddingToCart
                      ? <LoaderIcon className="size-4 animate-spin" />
                      : inCart
                        ? <><Check className="size-4" />In Cart</>
                        : <><ShoppingCart className="size-4" />Add to Cart</>}
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    disabled={wishlistPending}
                    className={`flex items-center justify-center w-12 h-12 rounded-xl border transition-all active:scale-95 disabled:opacity-50 cursor-pointer
                      ${inWishlist ? "bg-red-900/20 border-red-700/40 text-red-400" : "bg-[#1C1C1E] border-[#2A2A2A] text-white/50 hover:text-red-400 hover:border-red-700/30"}`}
                  >
                    {wishlistPending
                      ? <LoaderIcon className="size-5 animate-spin" />
                      : <Heart className={`size-5 ${inWishlist ? "fill-red-400" : ""}`} />}
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

export default ProductDetailPage
