import { useState, useEffect } from "react";
import style from "./CategoryNavigation.module.scss";

import { IconChevronDown, IconChevronUp } from "../../../Assets/Icon";

export default function CategoryNavigation({ onSelect, active: propActive }) {
  const categories = [
    { id: "Fruits", name: "Fresh Fruit" },
    { id: "Vegetables", name: "Vegetables" },
    { id: "Cooking", name: "Cooking" },
    { id: "Snacks", name: "Snacks" },
    { id: "Beverages", name: "Beverages" },
    { id: "Beauty&Health", name: "Beauty & Health" },
    { id: "Bread&Bakery", name: "Bread & Bakery" },
  ];

  const [open, setOpen] = useState(true);
  const [active, setActive] = useState(propActive || "Fruits");
  const [counts, setCounts] = useState({});

  useEffect(() => {
    if (propActive) setActive(propActive);
  }, [propActive]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/app/products/category-count"
        );
        const data = await res.json();
        setCounts(data);
      } catch (err) {
        console.error("Error fetching category counts", err);
      }
    };

    fetchCounts();
  }, []);

  const handleClick = (id) => {
    setActive(id);
    onSelect(id);
  };

  return (
    <div className={style.container}>
      <div className={style.header} onClick={() => setOpen(!open)}>
        All Categories
        {open ? <IconChevronUp /> : <IconChevronDown />}
      </div>

      {open && (
        <ul className={style.list}>
          {categories.map((item) => (
            <li
              key={item.id}
              className={`${style.item} ${
                active === item.id ? style.active : ""
              }`}
              onClick={() => handleClick(item.id)}
            >
              <label>
                <input
                  type="radio"
                  name="category"
                  checked={active === item.id}
                  readOnly
                  className={style.radio}
                />

                <span className={style.name}>{item.name}</span>
                <span className={style.count}>({counts[item.id] || 0})</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
