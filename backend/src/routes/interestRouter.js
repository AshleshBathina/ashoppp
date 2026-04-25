import { Router } from "express";
import { submitInterest, submitBulkInterest } from "../controllers/interestController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protectRoute);

router.post("/", submitInterest);
router.post("/bulk", submitBulkInterest);

export default router;
