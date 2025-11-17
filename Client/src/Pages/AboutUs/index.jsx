import { useNavigate } from "react-router-dom";

import style from "./About.module.scss";

import {
  ImgAboutUs,
  ImgAboutMe,
  ImgWeDelivered,
  IconArrow,
  IconLeaf_2,
  IconHeadphones_1,
  IconStars_1,
  IconShoppingBag,
  IconDeliveryTruck_1,
  IconPackage,
  IconCheck_1,
  IconAbout_1,
  IconAbout_2,
  IconAbout_3,
  IconAbout_4,
  IconAbout_5,
  IconAbout_6,
} from "../../Assets";
import Button from "../../Components/Button";

const feature = [
  {
    icon: <IconLeaf_2 />,
    title: "100% Organic food",
    description: "100% healthy & Fresh food",
  },
  {
    icon: <IconHeadphones_1 />,
    title: "Great Support 24/7",
    description: "Instant access to Contact",
  },
  {
    icon: <IconStars_1 />,
    title: "Customer Feedback",
    description: "Our happy customer",
  },
  {
    icon: <IconShoppingBag />,
    title: "100% Secure Payment",
    description: "We ensure your money is save",
  },
  {
    icon: <IconDeliveryTruck_1 />,
    title: "Free Shipping",
    description: "Free shipping with discount",
  },
  {
    icon: <IconPackage />,
    title: "100% Organic Food",
    description: "100% healthy & Fresh food.",
  },
];

const featureWe = [
  {
    icon: <IconCheck_1 />,
    description: "Sed in metus pellentesque.",
  },
  {
    icon: <IconCheck_1 />,
    description: "Fusce et ex commodo, aliquam nulla efficitur, tempus lorem.",
  },
  {
    icon: <IconCheck_1 />,
    description: "Maecenas ut nunc fringilla erat varius.",
  },
];

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className={style.aboutContainer}>
      <div className={style.aboutUs}>
        <div className={style.content}>
          <h1>100% Trusted Organic Food Store</h1>
          <p>
            Morbi porttitor ligula in nunc varius sagittis. Proin dui nisi,
            laoreet ut tempor ac, cursus vitae eros. Cras quis ultricies elit.
            Proin ac lectus arcu. Maecenas aliquet vel tellus at accumsan. Donec
            a eros non massa vulputate ornare. Vivamus ornare commodo ante, at
            commodo felis congue vitae.
          </p>
        </div>
        <img src={ImgAboutUs} alt="" />
      </div>
      <div className={style.aboutMe}>
        <img src={ImgAboutMe} alt="" />
        <div className={style.content}>
          <h1>100% Trusted Organic Food Store</h1>
          <p>
            Pellentesque a ante vulputate leo porttitor luctus sed eget eros.
            Nulla et rhoncus neque. Duis non diam eget est luctus tincidunt a a
            mi. Nulla eu eros consequat tortor tincidunt feugiat.{" "}
          </p>
          <div className={style.featureBox}>
            {feature.map((item, index) => (
              <div key={index} className={style.featureItem}>
                <div className={style.icon}>{item.icon}</div>
                <div className={style.text}>
                  <div className={style.title}>{item.title}</div>
                  <div className={style.description}>
                    <p>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={style.weDelivered}>
        <div className={style.content}>
          <h1>We Delivered, You Enjoy Your Order.</h1>
          <p>
            Ut suscipit egestas suscipit. Sed posuere pellentesque nunc,
            ultrices consectetur velit dapibus eu. Mauris sollicitudin dignissim
            diam, ac mattis eros accumsan rhoncus. Curabitur auctor bibendum
            nunc eget elementum.
          </p>
          <div className={style.featureWeBox}>
            {featureWe.map((item, index) => (
              <div key={index} className={style.featureWeItem}>
                <div className={style.iconCheck}>{item.icon}</div>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
          <Button
            fill
            className={style.btn}
            onClick={() => {
              navigate("/shop");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Shop now <IconArrow />
          </Button>
        </div>
        <img src={ImgWeDelivered} alt="" />
      </div>
      <div className={style.companyLogo}>
        <IconAbout_1 />
        <hr />
        <IconAbout_2 />
        <hr />
        <IconAbout_3 />
        <hr />
        <IconAbout_4 />
        <hr />
        <IconAbout_5 />
        <hr />
        <IconAbout_6 />
      </div>
    </div>
  );
}
