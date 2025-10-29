import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import style from "./Navbar.module.scss";

import NavbarNavigation from "../../Layouts/Navigation/NavbarNavigation";
import CartIcon from "../CartIcon";

export default function Navbar() {
  const navigate = useNavigate();

  const handleGoToCart = () => {
    navigate("/shoppingCart");
  };

  return (
    <div className={style.navbarContainer}>
      <div className={`margin-auto ${style.smallOne}`}>
        <div className={style.mapPin}>
          <div className={style.iconMapPin}></div>
          <div className={style.location}>
            Store Location: VKU - Da Nang, Viet Nam
          </div>
        </div>
        <div className={style.links}>
          <div className={style.account}>Sign In / Sign Up</div>
        </div>
      </div>
      <div className={`margin-auto ${style.midle}`}>
        <div className={style.logoBox}>
          <div className={style.logo}></div>
          <div className={style.ecovera}>Ecovera</div>
        </div>
        <div className={style.searchBox}>
          <div className={style.iconSearch}></div>
          <div className={style.search}>
            <input
              className={style.inputSearch}
              type="text"
              placeholder="Search"
            />
          </div>
          <button className={style.btnSearch}>Search</button>
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
