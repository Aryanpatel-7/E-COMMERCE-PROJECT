import Cart from "../Model/cart.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const qty = Number(quantity) || 1;

    // Find user's cart
    let cart = await Cart.findOne({
      user: req.user.id,
    });

    // If cart doesn't exist, create new cart
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [
          {
            product: productId,
            quantity: qty,
          },
        ],
      });
    } else {
      // Check if product already exists in cart
      const existingItem = cart.items.find(
        (item) =>
          item.product.toString() === productId.toString()
      );

      if (existingItem) {
        // Increase quantity
        existingItem.quantity += qty;
      } else {
        // Add new product
        cart.items.push({
          product: productId,
          quantity: qty,
        });
      }

      await cart.save();
    }

    // Get updated cart with product details
    const updatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name image price"
    );

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.log("Add Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get user cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name image price"
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        totalItems: 0,
        totalPrice: 0,
        cart: {
          items: [],
        },
      });
    }

    let totalItems = 0;
    let totalPrice = 0;

    cart.items.forEach((item) => {
      totalItems += item.quantity;
      totalPrice += item.product.price * item.quantity;
    });

    res.status(200).json({
      success: true,
      totalItems,
      totalPrice,
      cart,
    });
  } catch (error) {
    console.log("Get Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// updateCart quantity
export const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }

    const qty = Number(quantity);

    if (qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.product.toString() === productId.toString()
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    item.quantity = qty;

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name image price"
    );

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.log("Update Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// remove item
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemExists = cart.items.some(
      (item) =>
        item.product.toString() === productId.toString()
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !== productId.toString()
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name image price"
    );

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.log("Remove Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


 // clearCart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.log("Clear Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};