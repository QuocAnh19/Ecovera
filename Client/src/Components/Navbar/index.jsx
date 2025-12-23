import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import style from "./Navbar.module.scss";
import NavbarNavigation from "../../Layouts/Navigation/Navbar";
import CartIcon from "../CartIcon";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  const loadUser = () => {
    const userString = localStorage.getItem("user");
    if (!userString) return setUser(null);

    try {
      const parsed = JSON.parse(userString);
      setUser(parsed);
    } catch (err) {
      console.error("Unable to parse user from localStorage", err);
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    const onUserUpdated = () => loadUser();

    window.addEventListener("userUpdated", onUserUpdated);
    return () => window.removeEventListener("userUpdated", onUserUpdated);
  }, []);

  const getProfileImageUrl = () => {
    if (!user) return defaultAvatar;

    const baseURL = "http://localhost:5000";

    if (user.image_url) {
      return `${baseURL}${user.image_url}`;
    }

    if (user.image) {
      return `${baseURL}/uploads/Dashboard/${user.image}`;
    }

    return defaultAvatar;
  };

  const defaultAvatar =
    "http://localhost:5000/uploads/Dashboard/default-avatar.png";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGoToDashboard = () => navigate("/dashboard", { state: { user } });

  const handleGoToCart = () => navigate("/shoppingCart");

  return (
    <div
      className={`${style.navbarContainer} ${hidden ? style.hidden : ""}`}
      style={{ transition: "top 0.3s" }}
    >
      <div className={`margin-auto ${style.smallOne}`}>
        <div className={style.mapPin}>
          <div className={style.iconMapPin}></div>
          <div className={style.location}>
            Store Location: VKU - Da Nang, Viet Nam
          </div>
        </div>

        <div className={style.links}>
          {user ? (
            <div className={style.account}>
              Hi, {user.name || "User"}
              <div
                className={style.profile}
                onClick={handleGoToDashboard}
                style={{
                  backgroundImage: `url('${getProfileImageUrl()}')`,
                }}
              ></div>
            </div>
          ) : (
            <div className={style.account} onClick={() => navigate("/signin")}>
              Sign In / Sign Up
            </div>
          )}
        </div>
      </div>

      <div className={`margin-auto ${style.midle}`}>
        <div
          className={style.logoBox}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className={style.logo}></div>
          <div className={style.ecovera}>Ecovera</div>
        </div>

        <CartIcon handleGoToCart={handleGoToCart} />
      </div>

      <div className={style.backgroundNavLinks}>
        <div className={`margin-auto ${style.navLinks}`}>
          <NavbarNavigation />
          <div className={style.phone}>
            <div className={style.icon}></div>
            <div className={style.number}>(219) 555-0114</div>
          </div>
        </div>
      </div>
    </div>
  );
}
