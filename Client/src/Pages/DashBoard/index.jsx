import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import style from "./Dashboard.module.scss";

import DashboardNavigation from "../../Layouts/Navigation/Dashboard";
import { ImgIllustration } from "../../Assets";
import Button from "../../Components/Button";

export default function Dashboard() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  const [activeSection, setActiveSection] = useState("dashboard");

  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isAddressEditing, setIsAddressEditing] = useState(false);

  const [name, setName] = useState("Guest User");
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "Guest User");
      setImage(user.image || null);
      setAddress(user.address || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (location.state?.user) {
      setUser(location.state.user);
    } else {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      }
    }
  }, [location.state]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const handleSave = async (section) => {
    if (!user?.user_id) {
      alert("⚠️ Không thể lưu: chưa có thông tin người dùng.");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", user.user_id);

    formData.append("name", name);
    formData.append("address", address);
    formData.append("email", email);
    formData.append("phone", phone);

    if (image instanceof File) {
      formData.append("image", image);
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/updateProfile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Cập nhật thành công!");

        if (section === "profile") {
          setIsProfileEditing(false);
        } else if (section === "address") {
          setIsAddressEditing(false);
        }

        if (data.user) {
          setUser(data.user);
          setName(data.user.name);
          setImage(data.user.image);
          setAddress(data.user.address);
          setEmail(data.user.email);
          setPhone(data.user.phone);
          setPreview(null);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      }
    } catch (err) {
      console.error(err);
      alert("Đã có lỗi khi lưu.");
    }
  };

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
            <div className={style.profile}>
              <div className={style.img}>
                <img
                  src={
                    preview
                      ? preview
                      : user?.image_url
                      ? `http://localhost:5000${user.image_url}`
                      : user?.image
                      ? `http://localhost:5000/uploads/Dashboard/${user.image}`
                      : "http://localhost:5000/uploads/Dashboard/default-avatar.png"
                  }
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={style.inputEdit}
                    />
                  ) : (
                    user?.name || name || "Guest User"
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
            <div className={style.bg}>
              <div className={style.title}>BILLING ADDRESS</div>
              <div className={style.name}>
                {isAddressEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={style.inputEdit}
                  />
                ) : (
                  name || "Guest User"
                )}
              </div>
              <p>
                {isAddressEditing ? (
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={style.inputEdit}
                  />
                ) : (
                  address || "Chưa có địa chỉ"
                )}
              </p>
              <div className={style.email}>
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
              <div className={style.phone}>
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
              {!isAddressEditing ? (
                <div
                  className={style.edit}
                  onClick={() => setIsAddressEditing(true)}
                >
                  Edit Address
                </div>
              ) : (
                <div
                  className={style.edit}
                  onClick={() => handleSave("address")}
                >
                  Save
                </div>
              )}
            </div>
          </div>
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
