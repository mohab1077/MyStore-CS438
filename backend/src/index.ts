import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import path from "path";
import userRoute from "./routes/userRoute";

dotenv.config();

const app = express();
const port = 5001;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API is running");
});

//app.use("/shop", ); //commendt this for avoid error 
//app.use("/product", ); //commendt this for avoid error
app.use("/user",userRoute );
//app.use("/upload", ); //commendt this for avoid error

// for pictures
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ❗ Error Middleware 
app.use((err: any, req: any, res: any, next: any) => {
  console.error("ERROR 💥", err);
  return res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});


mongoose
  .connect(process.env.DATABASE_URL || "")
  .then(() => console.log("Mongo connected!"))
  .catch((err) => console.log("Failed to connect!", err));

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at: http://0.0.0.0:${port}`);
});