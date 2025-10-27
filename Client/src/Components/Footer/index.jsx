
import style from "./Footer.module.scss";

import Button from "../Button";
import { IconFacebook, IconInstagram, IconPinterest, IconTwitter } from "../../Assets/Icon";
import FooterNavigation from "../../Layouts/Navigation/Footer";
import { ImgApplePay, ImgCart, ImgDiscover, ImgMastercard, ImgVisa } from "../../Assets/Image/Footer";

export default function Footer() {
  return (
    <div className={style.container}>
      <div className={style.subscribeBackground}>
        <div className={style.subscribe}>
          <div className={style.content}>
            <div className={style.title}>Subscribe our Newsletter</div>
            <p>
              Pellentesque eu nibh eget mauris congue mattis mattis nec tellus.
              Phasellus imperdiet elit eu magna.
            </p>
          </div>
          <div className={style.emailSearch}>
            <input type="text" placeholder="Your email address" />
            <Button fill>Subscribe</Button>
          </div>
          <div className={style.iconSocial}>
              <Button size="circleSocial" fillCircle  icon={<IconFacebook />}></Button>
              <Button size="circleSocial" fillCircle icon={<IconTwitter />}></Button>
              <Button size="circleSocial" fillCircle icon={<IconPinterest />}></Button>
              <Button size="circleSocial" fillCircle icon={<IconInstagram />}></Button>
          </div>
        </div>
      </div>
      
      <div className={style.footerBoxBackground}>
        <div className={style.footerBox}>
          <div className={style.footer}>
            <div className={style.left}>
              <div className={style.logo}>
                <h5>Ecovera</h5>
              </div>
              <p>Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis dui, eget bibendum magna congue nec.</p>
              <div className={style.cta}>
                <button>(219) 555-0114</button>
                <p>or</p>
                <button>Proxy@gmail.com</button>
              </div>
            </div>
            <div className={style.right}>
              <FooterNavigation />
            </div>
          </div>
          <div className={style.copyRight}>
            <p>Ecobazar eCommerce © 2021. All Rights Reserved</p>
            <div className={style.copyRightImg}>
              <img src={ImgApplePay} alt="" />
              <img src={ImgVisa} alt="" />
              <img src={ImgDiscover} alt="" />
              <img src={ImgMastercard} alt="" />
              <img src={ImgCart} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
