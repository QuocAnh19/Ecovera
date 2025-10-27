import clsx from "clsx";

import style from "./Tag.module.scss";

export default function Tag({
  tagSale = false,
  tagNew = false,
  tagBestSale = false,
  tagOutOfStock = false,
  children,
  type,
  className,
  ...passProps
}) {
  // type = sale 50%
  const classNames = clsx(style.wrapper, className, {
    [style.tagSale]: type.match(/^\s*sale\b/i), // matches "sale" at the start, case insensitive
    [style.tagNew]: type.match(/^\n*new\b/i),
    [style.tagBestSale]: type === "bestSale",
    [style.tagOutOfStock]: type === "OutOfStock",
  });

  const Component = "span";

  return (
    <Component className={classNames} {...passProps}>
      {children}
    </Component>
  );
}
