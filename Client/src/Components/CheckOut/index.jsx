import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import style from "./CheckOut.module.scss";
import { useCart } from "../../ConText/CartContext";
import Button from "../Button";

export default function CheckOut() {
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);
  const [editingAddress, setEditingAddress] = useState(false);
  const [tempForm, setTempForm] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();

  const formState = {
    name: "",
    company: "",
    address: "",
    email: "",
    phone: "",
    notes: "",
  };

  const [form, setForm] = useState(formState);
  const [defaultAddress, setDefaultAddress] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updater = editingAddress ? setTempForm : setForm;

    updater((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // const handleSubmit = () => {
  //   setForm((prev) => { prev, paymentMethod });

  // }

  const handleChangePaymentMethod = (e) => {
    const { value } = e.target;
    setPaymentMethod(value);
  };

  const handleUseDefaultAddress = () => {
    setForm(defaultAddress);
    setEditingAddress(false);
  };

  const handleOpenEditForm = () => {
    setTempForm({ formState });
    setEditingAddress(true);
  };

  const handleCancelEditForm = () => {
    setEditingAddress(false);
    setTempForm({});
  };

  const handleSaveEditForm = () => {
    const requiredFields = ["name", "address", "email", "phone"];

    for (const field of requiredFields) {
      if (!tempForm[field] || String(tempForm[field]).trim() === "") {
        alert(`Vui lòng nhập đầy đủ thông tin: Trường [ ${field} ] còn trống.`);
        return;
      }
    }

    setForm({
      ...tempForm,
      address: tempForm.address,
    });
    setEditingAddress(false);
    setTempForm({});
  };

  const total = cartItems.reduce((acc, item) => {
    const price = item.sale_price ? item.sale_price : item.original_price;
    return acc + price * item.quantity;
  }, 0);

  // Load user từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const u = JSON.parse(saved);

      const initialUserData = {
        name: u.name || "",
        address: u.address || "",
        email: u.email || "",
        phone: u.phone || "",
        company: u.company || "",
        notes: u.notes || "",
        paymentMethod: u.paymentMethod || "cod",
      };
      setUser(u);
      setDefaultAddress(initialUserData);
      setForm(initialUserData);
    } else {
      setDefaultAddress(formState);
      setForm(formState);
    }
  }, []);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const requiredFields = ["name", "address", "email", "phone"];

    for (const field of requiredFields) {
      if (!form[field] || String(form[field]).trim() === "") {
        alert(
          `Vui lòng nhập đầy đủ thông tin thanh toán: Trường [ ${field} ] còn thiếu.`
        );
        return;
      }
    }

    if (!cartItems.length) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
        },
        user_id: user?.user_id,
        cart: cartItems,
        total,
        payment_method: paymentMethod,
      };

      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in!");
        return;
      } // Gửi tạo đơn hàng

      const res = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Order created successfully!");

        const payRes = await fetch(
          `http://localhost:5000/api/orders/pay/${data.order_uuid}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const payData = await payRes.json();

        if (payData.success) {
          alert("💰 Payment successful!");
          clearCart();

          navigate("/");
        } else {
          console.error("Lỗi thanh toán:", payData.mess);
          alert("❌ Lỗi thanh toán: " + (payData.mess || "Vui lòng thử lại."));
        }
      } else {
        console.error("Lỗi tạo đơn hàng:", data.mess);
        alert(
          "❌ Không thể tạo đơn hàng! " +
            (data.mess || "Vui lòng kiểm tra lại thông tin.")
        );
      }
    } catch (err) {
      console.error(err);
      alert("Đã có lỗi khi tạo đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.checkoutContainer}>
      <div className={style.left}>
        <Button ghost className={style.btnReturn} onClick={() => navigate(-1)}>
          Return
        </Button>
        <form
          className={style.billingForm}
          onSubmit={handlePlaceOrder}
          method="POST"
        >
          <h2>Billing Information</h2>
          {!editingAddress && user && (
            <div className={style.addressContainer}>
              {JSON.stringify(defaultAddress) !== JSON.stringify(form) && (
                <div
                  className={`${style.savedAddressBox} ${style.fadedAddress}`}
                >
                  <div className={style.addressHeader}>
                    <strong>Default Address</strong>
                    <span className={style.defaultTag}>DEFAULT</span>
                  </div>
                  <div className={style.rowAddress}>
                    <div className={style.namePhone}>
                      <strong>{defaultAddress.name}</strong>
                      {defaultAddress.phone
                        ? `(+84)${defaultAddress.phone}`
                        : ""}
                    </div>
                    <div className={style.addressDetail}>
                      {defaultAddress.address || "No address yet"}
                    </div>
                  </div>
                  <div className={style.addressActions}>
                    <Button
                      ghost
                      className={style.changeBtn}
                      onClick={handleUseDefaultAddress}
                    >
                      Select default address
                    </Button>
                  </div>
                </div>
              )}
              <div className={style.savedAddressBox}>
                <div className={style.addressHeader}>
                  <strong>Current Shipping Address</strong>
                  {JSON.stringify(defaultAddress) === JSON.stringify(form) && (
                    <span className={style.defaultTag}>NOW</span>
                  )}
                </div>
                <div className={style.rowAddress}>
                  <div className={style.namePhone}>
                    <strong>{form.name}</strong>
                    {form.phone ? `(+84)${form.phone}` : ""}
                  </div>

                  <div className={style.addressDetail}>
                    {form.address || "No address yet"}
                  </div>

                  <div className={style.addressActions}>
                    <Button
                      ghost
                      className={style.changeBtn}
                      onClick={handleOpenEditForm}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FORM CHỈNH SỬA ĐỊA CHỈ */}
          {editingAddress && (
            <div className={style.editForm}>
              <div className={style.row}>
                <div className={style.formGroup}>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    name="name"
                    value={tempForm.name || ""}
                    onChange={handleChange}
                    className={style.inputCheckout}
                    required
                  />
                </div>

                <div className={style.formGroup}>
                  <label>Company Name (optional)</label>
                  <input
                    type="text"
                    placeholder="Company name"
                    name="company"
                    value={tempForm.company || ""}
                    onChange={handleChange}
                    className={style.inputCheckout}
                  />
                </div>
              </div>
              <div className={style.row}>
                <div className={style.formGroup}>
                  <label>Detailed Delivery Address</label>
                  <input
                    type="text"
                    placeholder="Please enter in full: House number, Street name, Commune/Ward, Province/City"
                    name="address"
                    value={tempForm.address || ""}
                    onChange={handleChange}
                    className={style.inputCheckout}
                    required
                  />
                </div>
              </div>
              <div className={style.row}>
                <div className={style.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={tempForm.email || ""}
                    onChange={handleChange}
                    className={style.inputCheckout}
                    required
                  />
                </div>

                <div className={style.formGroup}>
                  <label>Phone</label>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    name="phone"
                    value={tempForm.phone || ""}
                    onChange={handleChange}
                    className={style.inputCheckout}
                    required
                  />
                </div>
              </div>
              <div className={style.row}>
                <Button ghost onClick={handleCancelEditForm}>
                  Cancel
                </Button>

                <Button type="button" fill onClick={handleSaveEditForm}>
                  Save
                </Button>
              </div>
            </div>
          )}
        </form>
        <hr />
        <br />
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
      </div>

      {/* Order Summary */}
      <div className={style.orderSummary}>
        <h2>Order Summary</h2>

        {cartItems.map((item) => {
          const price = item.sale_price ? item.sale_price : item.original_price;

          return (
            <div key={item.id} className={style.item}>
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt={item.name}
                className={style.itemImage}
              />

              <div className={style.itemInfo}>
                <span className={style.itemName}>{item.name}</span>
                <span className={style.itemQuantity}>x{item.quantity}</span>
              </div>

              <span className={style.itemPrice}>
                ${(price * item.quantity).toFixed(2)}
              </span>
            </div>
          );
        })}

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
                checked={paymentMethod === "cod"}
                onChange={handleChangePaymentMethod}
              />
              Cash on Delivery
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="momo"
                checked={paymentMethod === "momo"}
                onChange={handleChangePaymentMethod}
              />
              Momo
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="amazon"
                checked={paymentMethod === "amazon"}
                onChange={handleChangePaymentMethod}
              />
              Amazon Pay
            </label>
          </div>
        </div>
        <div className={style.submitBox}>
          <Button fill onClick={handlePlaceOrder} className={style.btnSubmit}>
            {loading ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </div>
    </div>
  );
}
