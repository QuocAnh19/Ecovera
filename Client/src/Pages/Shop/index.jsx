import QuickView from "../../Components/Products/QuickView";
import ShoppingCart from "../../Components/ShoppingCart";
import style from "./Shop.module.scss";

export default function Shop() {
  return (
    <div className={style.shopContainer}>
      <ShoppingCart />
    </div>
  );
}
