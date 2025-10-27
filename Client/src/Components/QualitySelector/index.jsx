import React, { useState } from "react";

import style from "./QualitySelector.module.scss";

export default function QualitySelector() {
  const [quantity, setQuantity] = useState(0);

  const increase = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 1) {
      setQuantity(value);
    } else {
      setQuantity(1);
    }
  };
  return (
    <div className={style.qualityContainer}>
      <button className={style.btnQuality} onClick={decrease}>
        -
      </button>
      <input
        type="number"
        className={style.inputQuality}
        value={quantity}
        onChange={handleChange}
        min="1"
      />
      <button className={style.btnQuality} onClick={increase}>
        +
      </button>
    </div>
  );
}
