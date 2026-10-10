import React from "react";
import styles from "./Input.module.scss";

export const Input = ({
  label,
  error,
  icon,
  type = "text",
  id,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  className = "",
  ...props
}) => {
  const inputId = id || name;

  return (
    <div className={`${styles.inputGroup} ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.inputWrapper}>
        {icon && <span className={styles.iconWrapper}>{icon}</span>}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${styles.input} ${icon ? styles.withIcon : ""} ${
            error ? styles.hasError : ""
          }`.trim()}
          {...props}
        />
      </div>

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default Input;
