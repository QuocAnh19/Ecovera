import AddProduct from "./AddProduct";

import style from "./Admin.module.scss";

export default function Admin() {
  return (
    <div className={style.container}>
      <AddProduct />
    </div>
  );
}
