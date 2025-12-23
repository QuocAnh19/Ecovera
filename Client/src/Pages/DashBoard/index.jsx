import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import style from "./Dashboard.module.scss";

import DashboardNavigation from "../../Layouts/Navigation/Dashboard";
import OrderDetailPopup from "./OrderDetailPopup";
import Button from "../../Components/Button";
import Error from "../Error";

export default function Dashboard() {
  const navigate = useNavigate();

  // SECTION SELECTOR
  const [activeSection, setActiveSection] = useState("dashboard");

  // USER DATA
  const [user, setUser] = useState(null);

  // EDITING STATES
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isAddressEditing, setIsAddressEditing] = useState(false);

  // FORM STATES
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const [billingName, setBillingName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      fetch(`http://localhost:5000/api/users/getUser/${parsedUser.user_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          }
        })
        .catch((err) => console.log("Fetch user error:", err));
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    setProfileName(user.name || "");
    setProfileImage(user.image || null);

    setBillingName(user.name || "");
    setAddress(user.address || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setProfileImage(file);
  };

  const handleSave = async (section) => {
    if (!user?.user_id) return alert("No user ID!");

    const formData = new FormData();
    formData.append("user_id", user.user_id);

    if (section === "profile") {
      formData.append("name", profileName);
      if (profileImage instanceof File) {
        formData.append("image", profileImage);
      }
    }

    if (section === "address") {
      formData.append("name", billingName);
      formData.append("address", address);
      formData.append("email", email);
      formData.append("phone", phone);
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/updateProfile", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Lỗi: ${res.status} - ${text}`);
      }

      const data = await res.json();
      if (data.success && data.user) {
        alert("Update successful!");

        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));

        setPreview(null);
        section === "profile" && setIsProfileEditing(false);
        section === "address" && setIsAddressEditing(false);
      }
    } catch (err) {
      console.error(err);
      alert("Unable to update. Try again later.!");
    }
  };

  const profileImgSrc = preview
    ? preview
    : user?.image_url
    ? `http://localhost:5000${user.image_url}`
    : user?.image
    ? `http://localhost:5000/uploads/Dashboard/${user.image}`
    : "/default-avatar.png";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  // ORDER HISTORY STATES
  const [orders, setOrders] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    if (activeSection === "orderHistory" && user?.user_id) {
      fetchOrders();
    }
  }, [activeSection]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/user/${user.user_id}`
      );
      const data = await res.json();

      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error("Fetch orders error:", err);
    }
  };

  const handleOpenDetail = async (uuid) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/detail/${uuid}`
      );

      if (!res.ok) {
        console.log("HTTP Error:", res.status);
        return;
      }

      const data = await res.json();

      if (!data.success) {
        console.log("Detail error:", data.message);
        return;
      }

      setOrderInfo(data.order);
      setOrderItems(data.items);
      setOpenPopup(true);
      document.body.classList.add("noScroll");
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.left}>
        <DashboardNavigation
          active={activeSection}
          onSelect={setActiveSection}
        />
      </div>

      {activeSection === "dashboard" && (
        <div className={style.rightDashboard}>
          <div className={style.row}>
            {/* PROFILE */}
            <div className={style.profile}>
              <div className={style.img}>
                <img
                  src={profileImgSrc}
                  alt="avatar"
                  className={style.avatar}
                />

                {isProfileEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={style.inputImage}
                  />
                )}
              </div>

              <div className={style.info}>
                <div className={style.name}>
                  {isProfileEditing ? (
                    <input
                      className={style.inputEdit}
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                    />
                  ) : (
                    profileName
                  )}
                </div>

                <p className={style.user}>{user?.role || "Customer"}</p>
              </div>

              {!isProfileEditing ? (
                <div
                  className={style.edit}
                  onClick={() => setIsProfileEditing(true)}
                >
                  Edit Profile
                </div>
              ) : (
                <div
                  className={style.edit}
                  onClick={() => handleSave("profile")}
                >
                  Save
                </div>
              )}
            </div>

            {/* BILLING ADDRESS */}
            <div className={style.bg}>
              <div className={style.title}>Billing Address</div>

              <div className={style.row}>
                <label>Name:</label>
                {isAddressEditing ? (
                  <input
                    className={style.inputEdit}
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                  />
                ) : (
                  billingName
                )}
              </div>

              <div className={style.row}>
                <label>Address:</label>
                {isAddressEditing ? (
                  <input
                    className={style.inputEdit}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                ) : (
                  address || "No address yet"
                )}
              </div>

              <div className={style.row}>
                <label>Email:</label>
                {isAddressEditing ? (
                  <input
                    className={style.inputEdit}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                ) : (
                  email || "No email yet"
                )}
              </div>

              <div className={style.row}>
                <label>Phone:</label>
                {isAddressEditing ? (
                  <input
                    className={style.inputEdit}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                ) : (
                  phone || "No phone yet"
                )}
              </div>

              {!isAddressEditing ? (
                <div
                  className={style.edit}
                  onClick={() => setIsAddressEditing(true)}
                >
                  Edit Address
                </div>
              ) : (
                <div className={style.btn}>
                  <div
                    className={style.edit}
                    onClick={() => handleSave("address")}
                  >
                    Save
                  </div>
                  <div
                    className={style.edit}
                    onClick={() => setIsAddressEditing(false)}
                  >
                    Cancel
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSection === "orderHistory" && (
        <div className={style.rightOrderHistory}>
          <div className={style.heading}>Order History</div>

          {/* DANH SÁCH ĐƠN HÀNG */}
          <div className={style.orderList}>
            {orders.length === 0 ? (
              <div className={style.noOrder}>
                You don't have any orders yet..
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.order_id}
                  className={style.orderRow}
                  onClick={() => handleOpenDetail(order.order_uuid)}
                >
                  <div className={style.code}>#{order.order_id}</div>
                  <div className={style.amount}>${order.total_amount}</div>
                  <div className={style.status}>{order.status}</div>
                  <div className={style.date}>
                    {new Date(order.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Popup */}
          <OrderDetailPopup
            open={openPopup}
            onClose={() => {
              setOpenPopup(false);
              document.body.classList.remove("noScroll");
            }}
            items={orderItems}
            order={orderInfo}
          />
        </div>
      )}

      {activeSection === "setting" && (
        <div className={style.rightSetting}>
          <Error />
        </div>
      )}

      {activeSection === "logOut" && (
        <div className={style.rightLogOut}>
          <Button fill className={style.btn} onClick={handleLogout}>
            Confirm Logout
          </Button>
        </div>
      )}
    </div>
  );
}
