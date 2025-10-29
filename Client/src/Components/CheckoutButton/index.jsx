// import React from "react";
// import { useCart } from "../context/CartContext";

// export default function CheckoutButton() {
//   const { cartItems, clearCart } = useCart();

//   const handleCheckout = async () => {
//     if (cartItems.length === 0) return alert("Cart empty");
//     // Tính tổng
//     const total = cartItems.reduce((s, it) => s + it.price * it.quantity, 0);
//     // Prepare payload
//     const payload = { items: cartItems, total };

//     const res = await fetch("/create-order", { // if proxy isn't set, use /api/create-order
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     const data = await res.json();
//     if (data.paymentUrl) {
//       // redirect user to mock payment page
//       window.location.href = data.paymentUrl;
//       // optionally wait for callback/webhook to clear cart when paid
//     } else {
//       alert("Something went wrong");
//     }
//   };

//   return (
//     <button onClick={handleCheckout}>
//       Proceed to Checkout
//     </button>
//   );
// }
