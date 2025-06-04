import Order from "../models/orderModel.js";

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "order not found in the list" });
    }

    await Order.findByIdAndDelete(id);

    res.json({ message: "Order Cancel successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
