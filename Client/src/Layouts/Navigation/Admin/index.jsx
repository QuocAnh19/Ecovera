import React from "react";
import style from "./AdminNavigation.module.scss";

const adminNavLink = [
  {
    id: "addProduct",
    title: "Add Product",
  },
  {
    id: "productsList",
    title: "Products List",
  },
  {
    id: "orders",
    title: "Orders",
  },
  { id: "users", title: "Users" },
];

export default function AdminNavigation({ onSelect, active }) {
  return (
    <div className={style.container}>
      <div className={style.heading}>Admin Panel</div>
      {adminNavLink.map((item, index) => (
        <div
          key={index}
          className={`${style.item} ${active === item.id ? style.active : ""}`}
          onClick={() => onSelect(item.id)}
        >
            <div className={style.title}>{item.title}</div>
        </div>
      ))}
    </div>
  );
}
