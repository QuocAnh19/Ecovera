import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import style from "./Dashboard.module.scss";

import DashboardNavigation from "../../Layouts/Navigation/Dashboard";
import { ImgIllustration } from "../../Assets";
import Button from "../../Components/Button";

export default function Dashboard() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("dashboard");

  // Profile states
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  // Billing address states
  const [isAddressEditing, setIsAddressEditing] = useState(false);
  const [billingName, setBillingName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [preview, setPreview] = useState(null);

  // Load user from location or localStorage
  useEffect(() => {
    if (location.state?.user) {
      setUser(location.state.user);
    } else {
      const savedUser = localStorage.getItem("user");
      if (savedUser) setUser(JSON.parse(savedUser));
    }
  }, [location.state]);

  // Sync user data into states
  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfileImage(user.image || null);

      setBillingName(user.name || "");
      setAddress(user.address || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setProfileImage(file);
    }
  };

  const handleSave = async (section) => {
    if (!user?.user_id) {
      alert("⚠️ Không thể lưu: chưa có thông tin người dùng.");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", user.user_id);

    // Update profile
    if (section === "profile") {
      formData.append("name", profileName);
      if (profileImage instanceof File) {
        formData.append("image", profileImage);
      }
    }

    // Update billing/address
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
        // Nếu status là 4xx hoặc 5xx, tạo lỗi và nhảy sang catch
        const errorText = await res.text(); // Đọc phản hồi dưới dạng văn bản
        throw new Error(`Lỗi HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();

      console.log("Phản hồi từ Server:", data);

      if (data.success) {
        alert("✅ Cập nhật thành công!");

        if (section === "profile") setIsProfileEditing(false);
        if (section === "address") setIsAddressEditing(false);

        if (data.user) {
          setUser(data.user);

          setProfileName(data.user.name);
          setBillingName(data.user.name);
          setAddress(data.user.address);
          setEmail(data.user.email);
          setPhone(data.user.phone);

          setPreview(null);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      }
    } catch (err) {
      console.error("Lỗi chi tiết từ Server:", err);
      alert(
        "🔴 Lỗi! Không thể cập nhật hồ sơ. Vui lòng thử lại sau hoặc liên hệ hỗ trợ."
      );
    }
  };

  // Determine profile image src
  const profileImgSrc = preview
    ? preview
    : user?.image_url
    ? `http://localhost:5000${user.image_url}`
    : user?.image
    ? `http://localhost:5000/uploads/Dashboard/${user.image}`
    : "http://localhost:5000/uploads/Dashboard/default-avatar.png";

  return (
    <div className={style.container}>
      <div className={style.left}>
        <DashboardNavigation
          onSelect={setActiveSection}
          active={activeSection}
        />
      </div>

      {activeSection === "dashboard" && (
        <div className={style.rightDashboard} id="dashboard">
          <div className={style.row}>
            {/* PROFILE SECTION */}
            <div className={style.profile}>
              <div className={style.img}>
                <img
                  src={profileImgSrc}
                  alt="profile"
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
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className={style.inputEdit}
                    />
                  ) : (
                    profileName
                  )}
                </div>

                <div className={style.user}>
                  <p>{user?.role || "Customer"}</p>
                </div>
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
              <div className={style.title}>BILLING ADDRESS</div>

              <div className={style.name}>
                <div className={style.row}>
                  <label>Name: </label>
                  {isAddressEditing ? (
                    <input
                      type="text"
                      value={billingName}
                      onChange={(e) => setBillingName(e.target.value)}
                      className={style.inputEdit}
                    />
                  ) : (
                    billingName
                  )}
                </div>
              </div>

              <p>
                <div className={style.row}>
                  <label>Address:</label>
                  {isAddressEditing ? (
                    <>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={style.inputEdit}
                      />
                    </>
                  ) : (
                    address || "Chưa có địa chỉ"
                  )}
                </div>
              </p>

              <div className={style.email}>
                <div className={style.row}>
                  <label>Email: </label>
                  {isAddressEditing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={style.inputEdit}
                    />
                  ) : (
                    email || "Chưa có email"
                  )}
                </div>
              </div>

              <div className={style.phone}>
                <div className={style.row}>
                  <label>Phone: </label>
                  {isAddressEditing ? (
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={style.inputEdit}
                    />
                  ) : (
                    phone || "Chưa có số điện thoại"
                  )}
                </div>
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
                  <div className={style.edit}>Cancel</div>
                </div>
              )}
            </div>
          </div>

          {/* ORDER HISTORY SECTION */}
          <div className={style.orderHistory}>
            <div className={style.heading}>
              Recent Order History
              <Button className={style.btn}>View All</Button>
            </div>
          </div>
        </div>
      )}

      {activeSection === "orderHistory" && (
        <div className={style.rightOrderHistory} id="orderHistory">
          <div className={style.orderHistory}>
            <div className={style.heading}>Order History</div>
          </div>
        </div>
      )}

      {activeSection === "setting" && (
        <div className={style.rightSetting} id="setting">
          <div className={style.setting}>
            <img src={ImgIllustration} alt="" />
          </div>
        </div>
      )}

      {activeSection === "logOut" && (
        <div className={style.rightLogOut} id="logOut">
          <img src={ImgIllustration} alt="" />
        </div>
      )}
    </div>
  );
}
