// routes/payment.js
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

// In-memory orders (demo). Thay bằng DB thật (MySQL) khi production.
const orders = new Map();

// Create order
router.post("/create-order", (req, res) => {
  const { items, total, user } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Cart empty" });
  }
  const id = uuidv4();
  const order = {
    id,
    items,
    total,
    user: user || null,
    status: "pending",
    createdAt: new Date(),
  };
  orders.set(id, order);
  // mock payment url
  const paymentUrl = `${req.protocol}://${req.get("host")}/mock-pay/${id}`;
  res.json({ orderId: id, paymentUrl });
});

// Mock payment page: just returns JSON or render a simple HTML page
router.get("/mock-pay/:orderId", (req, res) => {
  const order = orders.get(req.params.orderId);
  if (!order) return res.status(404).send("Order not found");
  // Simple HTML page to click Pay / Cancel (for demo)
  res.send(`
    <html>
      <body style="font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh">
        <h2>Mock Payment</h2>
        <p>Order ID: ${order.id}</p>
        <p>Total: $${order.total.toFixed(2)}</p>
        <div style="margin-top:20px">
          <form method="POST" action="/mock-pay/${order.id}/complete" style="display:inline">
            <button style="padding:10px 20px;background:#2ecc71;border:none;color:white;border-radius:6px;cursor:pointer">Pay</button>
          </form>
          <form method="POST" action="/mock-pay/${order.id}/cancel" style="display:inline;margin-left:8px">
            <button style="padding:10px 20px;background:#e74c3c;border:none;color:white;border-radius:6px;cursor:pointer">Cancel</button>
          </form>
        </div>
      </body>
    </html>
  `);
});

// Complete payment
router.post("/mock-pay/:orderId/complete", (req, res) => {
  const id = req.params.orderId;
  const order = orders.get(id);
  if (!order) return res.status(404).send("Order not found");
  order.status = "paid";
  order.paidAt = new Date();
  orders.set(id, order);

  // In real integration you'd emit webhook or notify client
  // For demo redirect to a success page
  res.redirect(`/mock-pay/${id}/success`);
});

// Cancel
router.post("/mock-pay/:orderId/cancel", (req, res) => {
  const id = req.params.orderId;
  const order = orders.get(id);
  if (!order) return res.status(404).send("Order not found");
  order.status = "cancelled";
  orders.set(id, order);
  res.redirect(`/mock-pay/${id}/cancelled`);
});

router.get("/mock-pay/:orderId/success", (req, res) => {
  const order = orders.get(req.params.orderId);
  res.send(`<html><body><h2>Payment success</h2><p>Order ${order.id} paid. <a href="/">Back</a></p></body></html>`);
});

router.get("/mock-pay/:orderId/cancelled", (req, res) => {
  const order = orders.get(req.params.orderId);
  res.send(`<html><body><h2>Payment cancelled</h2><p>Order ${order.id} cancelled. <a href="/">Back</a></p></body></html>`);
});

// Optional: endpoint to check order status from frontend
router.get("/order/:id", (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) return res.status(404).json({ error: "Not found" });
  res.json(order);
});

module.exports = router;
