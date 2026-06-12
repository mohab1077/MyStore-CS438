import express from "express";
import cors from "cors";
import path from "path";
import shopRoutes from "../routes/shopRoutes";
import productRoute from "../routes/productRoute";
import userRoute from "../routes/userRoute";
import uploadRoutes from "../routes/uploadRoutes";
import orderRoute from "../routes/orderRoute";
import dotenv from "dotenv";
import mongoose from "mongoose";


const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/shop", shopRoutes);
app.use("/product", productRoute);
app.use("/user", userRoute);
app.use("/upload", uploadRoutes);
app.use("/order", orderRoute);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use((err: any, req: any, res: any, next: any) => {
  console.error("ERROR 💥", err);
  return res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});




dotenv.config();

const port = 5003;

mongoose
  .connect("mongodb://localhost:27017/cs438")
  .then(() => {
    console.log("Mongo connected!");

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server is running at: http://localhost:${port}`);
    });
  })
  .catch((err) => console.log("Failed to connect!", err));
export default app;