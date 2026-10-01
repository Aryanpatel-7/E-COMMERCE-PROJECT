import Cart from "../Model/cart.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cartItem = await Cart.create({
      user: req.user.id,
      product: productId,
      quantity,
    });

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      cartItem,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
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
// update quantity
export const updateCart = async (req, res) => {
  try {
    const { cartId, quantity } = req.body;

    const cart = await Cart.findByIdAndUpdate(
      cartId,
      { quantity },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// remove item
export const removeCartItem = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
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