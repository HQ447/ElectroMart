import Order from "../../models/orderModel.js";

async function allOrder(req, res) {
  try {
    const orders = await Order.find();
    if (!orders) return res.json({ message: "error in finding orders" });

    return res.json({ message: "All orders data fetch successfully ", orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default allOrder;
