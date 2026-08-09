import express from "express";
import { addProduct, deleteProduct, getProducts, getSingleProduct, updateProduct } from "../Controller/productController.js";
import authUser from "../Middleware/auth.js";
import upload from "../Middleware/upload.js";

const router = express.Router();

// public router
router.get("/",getProducts);
router.get("/:id",getSingleProduct);

// protected router

router.post("/",authUser, upload.single("image"),addProduct);
//router.post("/", upload.single("image"), addProduct);
router.put("/:id",authUser,updateProduct);
router.delete("/:id",authUser,deleteProduct);


export default router;