import React, { useState, useEffect } from "react";

import style from "./QualitySelector.module.scss";

export default function QualitySelector({ value, onChange }) {
  const [quantity, setQuantity] = useState(value ?? 1);

  useEffect(() => {
    if (value !== undefined) setQuantity(value);
  }, [value]);

  const increase = () => {
    const newVal = quantity + 1;
    setQuantity(newVal);
    onChange?.(newVal);
  };

  const decrease = () => {
    const newVal = quantity > 1 ? quantity - 1 : 1;
    setQuantity(newVal);
    onChange?.(newVal);
  };

  const handleChange = (e) => {
    let newVal = Number(e.target.value);
    if (isNaN(newVal) || newVal < 1) newVal = 1;
    setQuantity(newVal);
    onChange?.(newVal);
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
