import React, { useEffect, useState } from "react";

import style from "./Shop.module.scss";

import CategoryNavigation from "../../Layouts/Navigation/Category";
import Vegetables from "./Vegetables";
import FreshFruit from "./FreshFruit";

export default function Shop() {
  const [activeSection, setActiveSection] = useState("Fruits");

  return (
    <div className={style.container}>
      <div className={style.left}>
        <CategoryNavigation
          onSelect={setActiveSection}
          active={activeSection}
        />
      </div>
      <div className={style.right}>
        {activeSection === "Vegetables" && (
          <div className={style.vegetables} id="Vegetables">
            <Vegetables />
          </div>
        )}
        {activeSection === "Fruits" && (
          <div className={style.vegetables} id="Fruits">
            <FreshFruit />
          </div>
        )}
      </div>
    </div>
  );
}
