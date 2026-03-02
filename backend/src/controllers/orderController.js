import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { Review } from "../models/review.js"

export async function createOrder(req, res) {
  try {
    const user = req.user;

    const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: "No order items" });
    }

    for (const item of orderItems) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        return res.status(404).json({ error: `Product ${item.name} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` })
      }


    }

    const order = await Order.create({
      user: user._id,
      clerkId: user.clerkId,
      orderItems,
      shippingAddress,
      paymentResult,
      totalPrice
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      })
    }

    res.status(201).json({ message: "Order created successfully", order })
  } catch (error) {
    console.error("Error in createOrder controller: ", error);
    res.status(500).json({ error: "Internal server error" })
  }
}

export async function getUserOrders(req, res) {
  try {
    const orders = await Order.find({ clerkId: req.user.clerkId }).sort({ createdAt: -1 }).populate("orderItems.product");

    const orderId = orders.map((order) => order._id)
    const reviews = await Review.find({ orderId: { $in: orderId } })
    const reviewedOrdersIds = new Set(reviews.map((review) => review.orderId.toString()))

    const ordersWithReviewStatus = await Promise.all(
      orders.map(async (order) => {

        return {
          ...order.toObject(),
          hasReviewed: reviewedOrdersIds.has(order._id.toString()),
        }
      })
    )

    res.status(200).json({ orders: ordersWithReviewStatus });
  } catch (error) {
    console.error("Error in getUserOrders controller: ", error)
    res.status(500).json({ error: "Internal server error" })
  }
}