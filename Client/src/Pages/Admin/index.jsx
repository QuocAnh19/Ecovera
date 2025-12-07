import AddProduct from "./AddProduct";
import ProductsList from "../../Components/Products/ProductsList";

import style from "./Admin.module.scss";

export default function Admin() {
  return (
    <div className={style.container}>
      <AddProduct />
      <ProductsList />
    </div>
  );
}
