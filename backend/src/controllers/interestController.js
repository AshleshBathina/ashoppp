import { Interest } from "../models/interest.js";
import { Product } from "../models/product.js";
import { Cart } from "../models/cart.js";

// POST /api/interests/ — single product interest
export async function submitInterest(req, res) {
  try {
    const { productId, quantity = 1 } = req.body;
    const user = req.user;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Upsert: one interest record per user per product
    await Interest.findOneAndUpdate(
      { clerkId: user.clerkId, product: productId },
      {
        user: user._id,
        clerkId: user.clerkId,
        product: productId,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity,
        source: "product"
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: "Interest recorded successfully" });
  } catch (error) {
    console.error("Error in submitInterest controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// POST /api/interests/bulk — all cart items
export async function submitBulkInterest(req, res) {
  try {
    const user = req.user;

    const cart = await Cart.findOne({ clerkId: user.clerkId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const upserts = cart.items.map((item) => {
      const product = item.product;
      return Interest.findOneAndUpdate(
        { clerkId: user.clerkId, product: product._id },
        {
          user: user._id,
          clerkId: user.clerkId,
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          quantity: item.quantity,
          source: "cart"
        },
        { upsert: true, new: true }
      );
    });

    await Promise.all(upserts);

    return res.status(200).json({ message: "Interest recorded for all cart items" });
  } catch (error) {
    console.error("Error in submitBulkInterest controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// GET /api/admin/interests — admin view
export async function getAllInterests(req, res) {
  try {
    const interests = await Interest.find({})
      .populate("user", "email firstName lastName")
      .populate("product", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({ interests });
  } catch (error) {
    console.error("Error in getAllInterests controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
