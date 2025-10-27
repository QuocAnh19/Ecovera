import clsx from "clsx";

import style from "./Button.module.scss";

export default function Button({
  fill = false,
  border = false,
  ghost = false,
  icon = false,
  fillCircle = false,
  children,
  href,
  size = "medium",
  className,
  ...passProps
}) {
  const classNames = clsx(style.wrapper, className, style[size], {
    [style.fill]: fill,
    [style.border]: border,
    [style.ghost]: ghost,
    [style.fillCircle]: fillCircle,
  });

  const Component = href ? "a" : "button";

  return (
    <Component className={classNames} href={href} {...passProps}>
      {children}
      {icon}
    </Component>
  );
}
