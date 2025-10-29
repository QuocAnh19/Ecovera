import React, { useState } from "react";
import style from "./CheckOut.module.scss";
import { useCart } from "../../ConText/CartContext";
import Button from "../Button";

export default function CheckOut() {
  const { cartItems } = useCart();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    country: "",
    state: "",
    email: "",
    phone: "",
    notes: "",
    paymentMethod: "cod",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order submitted:", { form, cartItems });
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className={style.checkoutContainer}>
      <form className={style.billingForm} onSubmit={handleSubmit} method="POST">
        <h2>Billing Information</h2>
        <div className={style.row}>
          <div className={style.formGroup}>
            <label>First name</label>
            <input
              type="text"
              placeholder="Your first name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className={style.inputCheckout}
            />
          </div>

          <div className={style.formGroup}>
            <label>Last name</label>
            <input
              type="text"
              placeholder="Your last name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className={style.inputCheckout}
            />
          </div>

          <div className={style.formGroup}>
            <label>
              Company Name <span>(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Company name"
              name="company"
              value={form.company}
              onChange={handleChange}
              className={style.inputCheckout}
            />
          </div>
        </div>

        <div className={style.row}>
          <div className={style.formGroup}>
            <label>Street Address</label>
            <input
              type="text"
              placeholder="Your address"
              name="address"
              value={form.address}
              onChange={handleChange}
              className={style.inputCheckout}
            />
          </div>
        </div>

        <div className={style.row}>
          <div className={style.formGroup}>
            <label>Country / Region</label>
            <select name="country" value={form.country} onChange={handleChange}>
              <option value="">Select</option>
              <option value="usa">USA</option>
              <option value="vietnam">Vietnam</option>
            </select>
          </div>

          <div className={style.formGroup}>
            <label>States</label>
            <select name="state" value={form.state} onChange={handleChange}>
              <option value="">Select</option>
              <option value="state1">State 1</option>
              <option value="state2">State 2</option>
            </select>
          </div>
        </div>

        <div className={style.row}>
          <div className={style.formGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={style.inputCheckout}
            />
          </div>

          <div className={style.formGroup}>
            <label>Phone</label>
            <input
              type="tel"
              placeholder="Phone number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={style.inputCheckout}
            />
          </div>
        </div>

        <hr />

        <div className={style.additionalInfo}>
          <h3>Additional Info</h3>
          <div className={style.noteBox}>
            <label>Order Notes (Optional)</label>
            <textarea
              placeholder="Notes about your order, e.g. special notes for delivery"
              name="notes"
              value={form.notes}
              onChange={handleChange}
            />
          </div>
        </div>
      </form>

      {/* Order Summary */}
      <div className={style.orderSummary}>
        <h2>Order Summary</h2>

        {cartItems.map((item) => (
          <div key={item.id} className={style.item}>
            <img
              src={`http://localhost:5000/uploads/${item.image}`}
              alt={item.title}
              className={style.itemImage}
            />

            <div className={style.itemInfo}>
              <span className={style.itemName}>{item.title}</span>
              <span className={style.itemQuantity}>x{item.quantity}</span>
            </div>

            <span className={style.itemPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}

        <div className={style.summaryFooter}>
          <div className={style.rowSummary}>
            <p>Subtotal:</p>
            <span>${total.toFixed(2)}</span>
          </div>
          <hr />
          <div className={style.rowSummary}>
            <p>Shipping:</p>
            <span>Free</span>
          </div>
          <hr />
          <div className={style.rowSummary}>
            <p>Total:</p>
            <span className={style.totalValue}>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className={style.paymentMethod}>
          <h3>Payment Method</h3>
          <div className={style.methodBox}>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={form.paymentMethod === "cod"}
                onChange={handleChange}
              />
              Cash on Delivery
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={form.paymentMethod === "paypal"}
                onChange={handleChange}
              />
              Paypal
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="amazon"
                checked={form.paymentMethod === "amazon"}
                onChange={handleChange}
              />
              Amazon Pay
            </label>
          </div>
        </div>
        <div className={style.submitBox}>
          <Button fill onClick={handleSubmit} className={style.btnSubmit}>
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
