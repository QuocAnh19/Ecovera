import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import style from "./Admin.module.scss";

import AdminNavigation from "../../Layouts/Navigation/Admin";

import AddProduct from "./AddProduct";
import ProductsList from "../../Components/Products/ProductsList";
import Orders from "./Orders";
import Users from "./Users";

export default function Admin() {
  const [activeSection, setActiveSection] = useState("addProduct");
  const navigate = useNavigate();

  return (
    <div className={style.container}>
      <div className={style.left}>
        <AdminNavigation active={activeSection} onSelect={setActiveSection} />
      </div>

      <div className={style.right}>
        {activeSection === "addProduct" && <AddProduct />}
        {activeSection === "productsList" && <ProductsList />}
        {activeSection === "orders" && <Orders />}
        {activeSection === "users" && <Users />}
      </div>
    </div>
  );
}
