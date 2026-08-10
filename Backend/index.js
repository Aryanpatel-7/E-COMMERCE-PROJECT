import dotenv from "dotenv";
dotenv.config();
//console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
//console.log("API Key:", process.env.CLOUDINARY_API_KEY);
//console.log("API Secret exists:", !!process.env.CLOUDINARY_API_SECRET);
//console.log("API Secret length:", process.env.CLOUDINARY_API_SECRET?.length);
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./Routes/userRoutes.js";
import productRoutes from "./Routes/productRoutes.js";
import cartRoutes from "./Routes/cartRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js";
import categoryRoutes from "./Routes/categoryRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 4001;
const URI = process.env.mongoDBURI;

// connect to mongoDB
try {
  mongoose.connect(URI);
  console.log("Connected to mongoDB");
           
} catch (error) {
  console.log("Error", error);
  
}
app.get("/", (req, res) => {
  res.send("Backend Running");
});
app.use("/api/users",express.json(), userRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders",orderRoutes);

app.use("/api/categories",categoryRoutes);

app.listen(PORT, ()=> {
  console.log(`server is  listening on port ${PORT}`);
  
});