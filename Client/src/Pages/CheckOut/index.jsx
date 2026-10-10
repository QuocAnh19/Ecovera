import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import style from "./CheckOut.module.scss";
import { useCartStore } from "../../store/useCartStore";
import { orderApi } from "../../services/orderApi";
import Button from "../../Components/Button";

const INITIAL_FORM_STATE = {
  name: "",
  company: "",
  address: "",
  email: "",
  phone: "",
  notes: "",
};

export default function CheckOut() {
  const { cartItems, clearCart, totalAmount } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [editingAddress, setEditingAddress] = useState(false);
  const [tempForm, setTempForm] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [toast, setToast] = useState({ message: "", type: "success" });
  const toastTimerRef = useRef(null);

  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [defaultAddress, setDefaultAddress] = useState(INITIAL_FORM_STATE);
  const navigate = useNavigate();

  // Load thông tin người dùng từ localStorage khi khởi tạo
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setUser(u);

        const initialUserData = {
          name: u.name || "",
          address: u.address || "",
          email: u.email || "",
          phone: u.phone || "",
          company: u.company || "",
          notes: u.notes || "",
        };

        setDefaultAddress(initialUserData);
        setForm(initialUserData);
      } catch (err) {
        console.error("Lỗi parse thông tin user từ localStorage:", err);
        setDefaultAddress(INITIAL_FORM_STATE);
        setForm(INITIAL_FORM_STATE);
      }
    } else {
      setDefaultAddress(INITIAL_FORM_STATE);
      setForm(INITIAL_FORM_STATE);
    }

    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message, type = "success") => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast({ message: "", type: "success" });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updater = editingAddress ? setTempForm : setForm;

    updater((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleChangePaymentMethod = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleUseDefaultAddress = () => {
    setForm(defaultAddress);
    setEditingAddress(false);
  };

  const handleOpenEditForm = () => {
    setTempForm({ ...form });
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
        showToast(`Vui lòng nhập đầy đủ: trường [ ${field} ] còn trống.`, "error");
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

  // Tính tổng tiền đơn hàng
  const total =
    totalAmount ??
    cartItems.reduce((acc, item) => {
      const price = Number(
        item.price ?? item.sale_price ?? item.original_price ?? 0
      );
      return acc + price * (Number(item.quantity) || 1);
    }, 0);

  /**
   * Xử lý xác nhận và đặt hàng
   */
  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();

    // 1. Kiểm tra giỏ hàng
    if (!cartItems || cartItems.length === 0) {
      showToast("Giỏ hàng của bạn đang trống!", "error");
      return;
    }

    // 2. Kiểm tra thông tin người nhận hàng
    const requiredFields = ["name", "address", "email", "phone"];
    for (const field of requiredFields) {
      if (!form[field] || String(form[field]).trim() === "") {
        showToast(`Vui lòng điền đầy đủ trường [ ${field} ]`, "error");
        return;
      }
    }

    // 3. Chuẩn bị payload khớp chuẩn DTO của Backend
    const orderData = {
      shippingAddress: form.address.trim(),
      paymentMethod: paymentMethod.toUpperCase(),
      items: cartItems.map((item) => ({
        productId: item.productId || item.id || item.product_id,
        name: item.name,
        price: Number(item.price ?? item.sale_price ?? item.original_price ?? 0),
        quantity: Number(item.quantity) || 1,
      })),
      customer: {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        company: form.company ? form.company.trim() : "",
        notes: form.notes ? form.notes.trim() : "",
      },
    };

    setLoading(true);

    try {
      // 4. Gọi API tạo đơn hàng qua orderApi
      const response = await orderApi.createOrder(orderData);
      const createdOrder = response?.data || response;

      // 5. Thông báo đặt hàng thành công
      showToast("Đặt hàng thành công! Đang chuyển hướng...", "success");

      // 6. Xóa giỏ hàng trong Zustand Store & Server
      await clearCart();

      // 7. Điều hướng về trang Dashboard (mục Lịch sử đơn hàng)
      setTimeout(() => {
        navigate("/dashboard", {
          state: {
            activeSection: "orderHistory",
            orderUuid: createdOrder?.order_uuid || createdOrder?.orderId,
          },
        });
      }, 1500);
    } catch (err) {
      console.error("Lỗi khi đặt hàng:", err);
      const errMsg =
        err.message ||
        "Không thể hoàn tất đơn hàng. Vui lòng kiểm tra lại thông tin.";
      showToast(errMsg, "error");
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
                        ? ` (+84) ${defaultAddress.phone}`
                        : ""}
                    </div>
                    <div className={style.addressDetail}>
                      {defaultAddress.address || "No address yet"}
                    </div>
                  </div>
                  <div className={style.addressActions}>
                    <Button
                      type="button"
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
                    {form.phone ? ` (+84) ${form.phone}` : ""}
                  </div>

                  <div className={style.addressDetail}>
                    {form.address || "No address yet"}
                  </div>

                  <div className={style.addressActions}>
                    <Button
                      type="button"
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

          {/* Form chỉnh sửa địa chỉ */}
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
                    placeholder="House number, Street name, Commune/Ward, City"
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
                <Button type="button" ghost onClick={handleCancelEditForm}>
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
              value={form.notes || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className={style.orderSummary}>
        <h2>Order Summary</h2>

        {cartItems.map((item) => {
          const price = Number(
            item.price ?? item.sale_price ?? item.original_price ?? 0
          );
          const imageSrc = item.image
            ? item.image.startsWith("http")
              ? item.image
              : `http://localhost:5000/uploads/${item.image}`
            : "/placeholder.png";

          return (
            <div key={item.cartItemId || item.id} className={style.item}>
              <img
                src={imageSrc}
                alt={item.name}
                className={style.itemImage}
              />

              <div className={style.itemInfo}>
                <span className={style.itemName}>{item.name}</span>
                <span className={style.itemQuantity}>x{item.quantity}</span>
              </div>

              <span className={style.itemPrice}>
                ${(price * (Number(item.quantity) || 1)).toFixed(2)}
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
              Cash on Delivery (COD)
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="momo"
                checked={paymentMethod === "momo"}
                onChange={handleChangePaymentMethod}
              />
              Momo E-Wallet
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="banking"
                checked={paymentMethod === "banking"}
                onChange={handleChangePaymentMethod}
              />
              Bank Transfer / VNPAY
            </label>
          </div>
        </div>

        <div className={style.submitBox}>
          <Button
            type="button"
            fill
            onClick={handlePlaceOrder}
            className={style.btnSubmit}
            disabled={loading || cartItems.length === 0}
          >
            {loading ? "Processing..." : "Place Order"}
          </Button>
        </div>

        {toast.message && (
          <div
            className={`${style.toast} ${
              toast.type === "error" ? style.toastError : ""
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}
