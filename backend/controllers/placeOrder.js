import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";

export const placeOrder = async (req, res) => {
  try {
    const { userId, name, phone, address, deliveryCharges, totalAmount } =
      req.body;

    // Validate required fields
    if (!userId || !name || !phone || !address || !totalAmount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cartItems = await Cart.find({ userId });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cartItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      img: item.img,
      quantity: item.qty,
      price: item.price,
    }));

    const order = new Order({
      userId,
      name,
      phone,
      address,
      items,
      deliveryCharges,
      totalAmount,
    });

    await order.save();

    // Clear the cart after successful order
    await Cart.deleteMany({ userId });

    res.status(200).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
