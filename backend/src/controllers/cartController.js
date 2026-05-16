import { Cart } from "../models/cart.js"
import { Product } from "../models/product.js";

export async function getCart(req, res) {
  try {
    let cart = await Cart.findOne({ clerkId: req.user.clerkId }).populate('items.product')

    if (!cart) {
      const user = req.user;

      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkId,
        items: []
      })
    }

    return res.status(200).json({ cart })
  } catch (error) {
    console.error("Error in getCart controller", error);
    res.status(500).json({ error: "Internal server error" })
  }
}

export async function addToCart(req, res) {
  try {
    console.log('🛒 addToCart called with body:', req.body)
    const { productId, quantity = 1 } = req.body

    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" })
    }

    let cart = await Cart.findOne({ clerkId: req.user.clerkId }).populate('items.product')

    if (!cart) {
      const user = req.user;

      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkId,
        items: []
      })
    }

    console.log('🔍 Checking for existing item. Cart items:', cart.items.length)
    const existingItem = cart.items.find((item) => item.product._id.toString() === productId)
    console.log('📦 Existing item found:', !!existingItem)

    if (existingItem) {
      const newQuantity = ++existingItem.quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({ error: "Insufficient stock" })
      }

      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity })
    }

    await cart.save()
    console.log('✅ Cart saved successfully. Total items:', cart.items.length)

    //Re-populate after save to ensure frontend gets full product details
    await cart.populate('items.product')
    res.status(200).json({ cart })

  } catch (error) {
    console.error("Error in addToCart controller: ", error)
    res.status(500).json({ error: "Internal server error" })

  }
}

export async function updateCartItem(req, res) {
  try {
    const { productId } = req.params
    console.log(productId)

    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(403).json({ erro: "Cannot update to zero or lower values" });
    }

    const cart = await Cart.findOne({ clerkId: req.user.clerkId }).populate('items.product')

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" })
    }

    const itemIndex = cart.items.findIndex((item) => item.product._id.toString() === productId)

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Product not found" })
    }

    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Insufficient funds" })
    }

    cart.items[itemIndex].quantity = quantity;

    await cart.save()

    // Re-populate after save to ensure frontend gets full product details
    await cart.populate('items.product')

    res.status(200).json({ message: "Cart updated successfully", cart })
  } catch (error) {
    console.error("Error in updateCartItem controller", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export async function removeFromCart(req, res) {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ clerkId: req.user.clerkId }).populate('items.product')

    if (!cart) {
      return res.status(400).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.product._id.toString() !== productId)

    await cart.save()

    // Re-populate after save to ensure frontend gets full product details
    await cart.populate('items.product')

    res.status(200).json({ message: "Items removed from cart", cart })
  } catch (error) {
    console.error("Error in addToCart controller: ", error)
    res.status(500).json({ error: "Internal server error" })
  }

}

export async function clearCart(req, res) {
  try {
    const cart = await Cart.findOne({ clerkId: req.user.clerkId }).populate('items.product')

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" })
    }

    cart.items = [];
    await cart.save()

    res.status(200).json({ message: "Cart cleared", cart })
  } catch (error) {
    console.error("Error in addToCart controller: ", error)
    res.status(500).json({ error: "Internal server error" })
  }
}