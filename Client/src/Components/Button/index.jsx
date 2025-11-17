import clsx from "clsx";
import { useNavigate } from "react-router-dom";

import style from "./Button.module.scss";

export default function Button({
  fill = false,
  border = false,
  ghost = false,
  icon = false,
  fillCircle = false,
  closeBorder = false,
  children,
  href,
  onClick,
  size = "medium",
  className,
  ...passProps
}) {
  const classNames = clsx(style.wrapper, className, style[size], {
    [style.fill]: fill,
    [style.border]: border,
    [style.ghost]: ghost,
    [style.fillCircle]: fillCircle,
    [style.closeBorder]: closeBorder,
  });

  const navigate = useNavigate();

  const handleClick = (e) => {
    if (href) {
      e.preventDefault();
      navigate(href);
    } else if (onClick) {
      onClick(e);
    }
  };

  const Component = "button";

  return (
    <Component className={classNames} onClick={handleClick} {...passProps}>
      {children}
      {icon}
    </Component>
  );
}
