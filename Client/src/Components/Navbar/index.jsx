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

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        setUser(JSON.parse(userString));
      } catch (err) {
        console.error("Không thể parse user từ localStorage", err);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const getProfileImageUrl = () => {
    if (user?.image_url) return `http://localhost:5000${user.image_url}`;
    if (user?.image)
      return `http://localhost:5000/uploads/Dashboard/${user.image}`;
    return "http://localhost:5000/uploads/Dashboard/default-avatar.png";
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // cuộn xuống -> ẩn navbar
        setHidden(true);
      } else {
        // cuộn lên -> hiện navbar
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
      // optional: smooth transition
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
              Hi, {user.name || "User"}{" "}
              <div
                className={style.profile}
                onClick={handleGoToDashboard}
                style={{
                  backgroundImage: `url(${getProfileImageUrl()})`,
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
        {/* <div className={style.searchBox}>
          <div className={style.iconSearch}></div>
          <div className={style.search}>
            <input
              className={style.inputSearch}
              type="text"
              placeholder="Search"
            />
          </div>
          <button className={style.btnSearch}>Search</button>
        </div> */}
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
