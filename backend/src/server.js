import express from "express";

import { clerkMiddleware } from '@clerk/express'
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";

import cors from "cors"

import adminRouter from "./routes/adminRouter.js"
import userRouter from "./routes/userRouter.js"
import orderRouter from "./routes/orderRouter.js"
import reviewRouter from "./routes/reviewRouter.js"
import productRouter from "./routes/productRouter.js"
import cartRouter from "./routes/cartRouter.js"
import interestRouter from "./routes/interestRouter.js"


const app = express();

app.use(express.json());
app.use(clerkMiddleware());
app.use(cors({ origin: [ENV.CLIENT_URL, ENV.ADMIN_CLIENT_URL], credentials: true }))

app.use("/api/inngest", serve({ client: inngest, functions }))

app.use("/api/admin", adminRouter)
app.use("/api/users", userRouter)
app.use("/api/orders", orderRouter)
app.use("/api/reviews", reviewRouter)
app.use("/api/products", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/interests", interestRouter)

const PORT = process.env.PORT || 3000;

app.get("/api/health", (_, res) => {
  res.send("OK");
})

//make our app ready for deployment

// if (ENV.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../admin/dist")));

//   app.use((req, res) => {
//     res.sendFile(path.join(__dirname, "../admin/dist/index.html"));
//   });
// }

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ Server up and running on ${PORT}`);
  })
}

startServer();