import style from "./BannerSaleHome.module.scss";

import {
  BannerSale_1,
  BannerSale_2,
  BannerSale_3,
} from "../../../Assets/Image/Banner";

export default function BannerSaleHome() {
  return (
    <div className={style.container}>
      <div className={style.banner}>
        <img src={BannerSale_1} alt="" />
        <img src={BannerSale_2} alt="" />
        <img src={BannerSale_3} alt="" />
      </div>
    </div>
  );
}
