import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import style from "./SignIn.module.scss";

export default function SignIn() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ " + data.message);
        if (form.remember) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        setForm({ email: "", password: "", remember: false });

        navigate("/");
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
        <h2>Sign In</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

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

        <label className={style.checkbox}>
          <input
            type="checkbox"
            name="remember"
            checked={form.remember}
            onChange={handleChange}
          />
          <span>Remember me</span>
        </label>

        <button type="submit" className={style.loginBtn} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className={style.registerText}>
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}
