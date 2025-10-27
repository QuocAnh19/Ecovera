import QuickView from "../../Components/Products/QuickView";
import style from "./Shop.module.scss";

export default function Shop() {
  return (
    <div className={style.shopContainer}>
      <QuickView />
    </div>
  );
}
