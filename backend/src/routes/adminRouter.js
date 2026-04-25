import { Router } from "express";

import { createProduct, getAllProducts, updateProduct, deleteProduct, getAllOrders, updateOrderStatus, getAllCustomers, getDashboardStats } from '../controllers/adminController.js'
import { getAllInterests } from '../controllers/interestController.js'
import { adminOnly, protectRoute } from '../middleware/authMiddleware.js'
import { upload } from '../middleware/multerMiddleware.js'

const router = Router();

router.use(protectRoute, adminOnly)

router.post("/products", upload.array("images", 3), createProduct);
router.get("/products", getAllProducts);
router.put("/products/:id", upload.array("images", 3), updateProduct);
router.delete("/products/:id", deleteProduct);

router.get("/orders", getAllOrders)
router.patch("/orders/:orderId/status", updateOrderStatus)

router.get("/customers", getAllCustomers)
router.get("/stats", getDashboardStats)
router.get("/interests", getAllInterests)

export default router