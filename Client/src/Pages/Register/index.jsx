import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import style from "./Register.module.scss";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    accept: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.accept) {
      alert("Please accept the terms & conditions");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ " + data.message);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setForm({
          email: "",
          password: "",
          confirmPassword: "",
          accept: false,
        });
        navigate("/signin");
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.wrapper}>
      <form className={style.formContainer} onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* Password */}
        <div className={style.passwordGroup}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <span
            className={style.eyeIcon}
            onClick={() => setShowPassword(!showPassword)}
          >
            👁️
          </span>
        </div>

        {/* Confirm Password */}
        <div className={style.passwordGroup}>
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <span
            className={style.eyeIcon}
            onClick={() => setShowConfirm(!showConfirm)}
          >
            👁️
          </span>
        </div>

        {/* Checkbox */}
        <label className={style.checkbox}>
          <input
            type="checkbox"
            name="accept"
            checked={form.accept}
            onChange={handleChange}
          />
          <span>Accept all terms & Conditions</span>
        </label>

        {/* Submit */}
        <button type="submit" className={style.createBtn} disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        {/* Login link */}
        <p className={style.loginText}>
          Already have account <a href="/signin">Login</a>
        </p>
      </form>
    </div>
  );
}
