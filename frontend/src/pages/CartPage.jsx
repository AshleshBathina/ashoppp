import { ArrowRight, LoaderIcon, Minus, Plus, ShoppingCart, Trash2, ShoppingBag } from "lucide-react";
import useCart from "../hooks/useCart"
import roundNumber from "../utils/roundNumber";

const CartPage = () => {

  const { cart, updateCartItem, isAddingToCart, isRemovingFromCart, removeFromCart } = useCart()

  const isBusy = isAddingToCart || isRemovingFromCart;
  const cartItems = cart?.items || [];

  const subTotal = cartItems?.reduce((accumulator, cartItem) => {
    return accumulator + cartItem.product.price * cartItem.quantity
  }, 0)

  const updateProductQuantity = ({ productId, quantity }) => {
    if (quantity > 0) {
      updateCartItem({ productId, quantity });
    } else {
      removeFromCart(productId);
    }
  }

  return (
    <div className="flex flex-col min-h-screen h-full bg-[#0F0F0F]">

      {/* ──────────── MOBILE LAYOUT ──────────── */}
      <div className="md:hidden pt-7 pb-55">
        <div className="px-7 flex items-center">
          <h1 className="font-bold text-white text-2xl mr-2">Cart</h1>
        </div>

        <div className="overflow-y-scroll w-full">
          <ul className="flex flex-col px-4 mt-4 gap-4">
            {cartItems.map(cartItem => {
              const product = cartItem?.product || {};
              const quantity = cartItem?.quantity || 0;
              return (
                <li className="bg-[#222222] p-4 rounded-2xl flex" key={cartItem._id}>
                  <div className="relative mr-4 size-25">
                    <img className="rounded-xl size-full" src={product?.images[0]} />
                    <span className="absolute right-3 top-2 text-green-950 font-bold bg-green-600 text-xs px-3 w-5 rounded-2xl flex justify-center items-center">x{cartItem.quantity}</span>
                  </div>
                  <div className="flex flex-col gap-2 w-[65%]">
                    <h1 className="text-white text-md font-semibold">{product.name}</h1>
                    <p className="text-green-400 font-semibold gap-2 flex items-center text-xl">₹{(product.price * quantity).toFixed(2)} <span className="text-white/60 text-xs font-normal">₹{roundNumber(product.price)} each</span></p>

                    <div className="flex justify-between w-full items-center">
                      <div className="flex items-center gap-4">
                        <button disabled={isBusy} className="disabled:opacity-50 disabled:cursor-not-allowed text-white size-7 flex items-center rounded-full p-1 justify-center" onClick={() => updateProductQuantity({ productId: product._id, quantity: quantity - 1 })}>
                          {isBusy ? <LoaderIcon className="text-white animate-spin size-7" /> : <Minus className="size-4" />}
                        </button>
                        <p className="text-white text-sm">{cartItem.quantity}</p>
                        <button className="disabled:opacity-50 disabled:cursor-not-allowed bg-green-500 size-7 flex items-center rounded-full p-1 justify-center" onClick={() => updateProductQuantity({
                          productId: product._id, quantity: quantity + 1
                        })}>
                          {isBusy ? <LoaderIcon className="text-white animate-spin size-7" /> : <Plus className="size-4" />}
                        </button>
                      </div>
                      <button className="bg-red-800/20 p-2 rounded-full" onClick={() => removeFromCart(product._id)}>
                        <Trash2 className="text-red-500 size-5" />
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="p-4 flex flex-col">
            <div className="rounded-2xl bg-[#222222] p-4">
              <h1 className="text-white text-lg font-semibold">Summary</h1>
              <div className="w-full flex justify-between mt-3">
                <p className="text-md text-white/50">Subtotal</p>
                <p className="text-white">₹{roundNumber(subTotal)}</p>
              </div>
              <div className="w-full flex justify-between">
                <p className="text-md text-white/50">Shipping Charge</p>
                <p className="text-white">₹10</p>
              </div>
              <div className="flex flex-row justify-between mt-3">
                <p className="text-white font-semibold text-lg">Total</p>
                <p className="font-bold text-green-400 text-xl">₹{roundNumber(subTotal + 10)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col justify-start items-center p-4
         fixed bg-[#0F0F0F] bottom-0 gap-3 h-55 border-t-2 border-[#222222] right-0 left-0">
          <div className="flex justify-between items-center w-full">
            <p className="flex items-center text-white/65">
              <ShoppingCart className="text-green-400 size-5 mr-2 fill-green-400" />
              {cartItems?.length || 0} {cartItems.length == 1 ? 'item' : 'items'}
            </p>
            <p className="text-white text-lg font-medium">₹{roundNumber(subTotal)}</p>
          </div>
          <button className="bg-green-400 flex justify-center p-4 text-md font-bold rounded-2xl w-full items-center">Checkout <ArrowRight className="size-6 ml-2" /></button>
        </div>
      </div>

      {/* ──────────── DESKTOP LAYOUT ──────────── */}
      <div className="hidden md:flex flex-col h-full min-h-screen">

        {/* Header */}
        <header className="flex items-center justify-between px-10 py-5 border-b border-[#1A1A1A] bg-[#0F0F0F] sticky top-0 z-10">
          <div>
            <h1 className="font-bold text-white text-3xl">Your Cart</h1>
            <p className="text-[#6B7280] text-sm mt-0.5">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </header>

        {cartItems.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <ShoppingBag className="text-[#333] size-20" />
            <p className="text-white/50 text-lg">Your cart is empty</p>
          </div>
        ) : (
          /* Two-column layout: cart items + order summary */
          <div className="flex flex-1 gap-8 px-10 py-8 items-start">

            {/* Left — cart items list */}
            <div className="flex-1 flex flex-col gap-4">
              <p className="text-[#555] text-[11px] uppercase tracking-widest font-semibold">Items</p>
              <ul className="flex flex-col gap-3">
                {cartItems.map(cartItem => {
                  const product = cartItem?.product || {};
                  const quantity = cartItem?.quantity || 0;
                  return (
                    <li
                      key={cartItem._id}
                      className="bg-[#161616] border border-[#222222] hover:border-green-500/20 transition-all duration-300 p-5 rounded-2xl flex items-center gap-6 group"
                    >
                      {/* Product image */}
                      <div className="relative size-24 shrink-0">
                        <img className="rounded-xl size-full object-cover" src={product?.images[0]} alt={product.name} />
                      </div>

                      {/* Product info */}
                      <div className="flex-1 flex flex-col gap-1 min-w-0">
                        <p className="text-[#6B7280] text-xs uppercase tracking-wide">{product.category}</p>
                        <h2 className="text-white font-semibold text-base leading-snug line-clamp-2">{product.name}</h2>
                        <p className="text-white/40 text-sm">₹{roundNumber(product.price)} each</p>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          disabled={isBusy}
                          className="disabled:opacity-40 disabled:cursor-not-allowed size-8 flex items-center justify-center rounded-full bg-[#222] hover:bg-[#2e2e2e] border border-[#333] text-white transition-colors"
                          onClick={() => updateProductQuantity({ productId: product._id, quantity: quantity - 1 })}
                        >
                          {isBusy ? <LoaderIcon className="text-white animate-spin size-4" /> : <Minus className="size-3.5" />}
                        </button>
                        <span className="text-white font-semibold text-sm w-6 text-center">{quantity}</span>
                        <button
                          disabled={isBusy}
                          className="disabled:opacity-40 disabled:cursor-not-allowed size-8 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-400 transition-colors"
                          onClick={() => updateProductQuantity({ productId: product._id, quantity: quantity + 1 })}
                        >
                          {isBusy ? <LoaderIcon className="text-white animate-spin size-4" /> : <Plus className="size-3.5" />}
                        </button>
                      </div>

                      {/* Line total */}
                      <p className="text-green-400 font-bold text-lg w-28 text-right shrink-0">
                        ₹{(product.price * quantity).toFixed(2)}
                      </p>

                      {/* Remove button */}
                      <button
                        className="shrink-0 p-2 rounded-full bg-red-800/10 hover:bg-red-800/30 transition-colors"
                        onClick={() => removeFromCart(product._id)}
                      >
                        <Trash2 className="text-red-500 size-4.5" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Right — Order summary sidebar */}
            <div className="w-80 shrink-0 sticky top-24">
              <p className="text-[#555] text-[11px] uppercase tracking-widest font-semibold mb-4">Order Summary</p>
              <div className="bg-[#161616] border border-[#222222] rounded-2xl p-6 flex flex-col gap-4">

                {/* Line items */}
                <div className="flex flex-col gap-3">
                  {cartItems.map(cartItem => {
                    const product = cartItem?.product || {};
                    const quantity = cartItem?.quantity || 0;
                    return (
                      <div key={cartItem._id} className="flex justify-between items-center gap-2">
                        <p className="text-white/60 text-sm truncate flex-1">{product.name}</p>
                        <p className="text-white text-sm shrink-0">₹{(product.price * quantity).toFixed(2)}</p>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-[#2A2A2A]" />

                {/* Subtotal & Shipping */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <p className="text-white/50 text-sm">Subtotal</p>
                    <p className="text-white text-sm">₹{roundNumber(subTotal)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-white/50 text-sm">Shipping</p>
                    <p className="text-white text-sm">₹10</p>
                  </div>
                </div>

                <div className="border-t border-[#2A2A2A]" />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <p className="text-white font-semibold text-base">Total</p>
                  <p className="text-green-400 font-bold text-xl">₹{roundNumber(subTotal + 10)}</p>
                </div>

                {/* Checkout CTA */}
                <button className="mt-1 bg-green-400 hover:bg-green-300 transition-colors flex justify-center items-center gap-2 p-3.5 text-sm font-bold rounded-xl w-full">
                  Proceed to Checkout <ArrowRight className="size-4" />
                </button>

                {/* Items badge */}
                <p className="text-center text-white/30 text-xs flex items-center justify-center gap-1.5">
                  <ShoppingCart className="size-3.5" />
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  )
}

export default CartPage