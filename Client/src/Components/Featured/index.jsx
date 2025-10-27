import style from "./Featured.module.scss";

import { IconDeliveryTruck_1, IconHeadphones_1, IconShoppingBag, IconPackage } from "../../Assets";

const feature = [
  {
    icon: <IconDeliveryTruck_1 />,
    title: "Free Shipping",
    description: "Free shipping on all your order",
  },
  {
    icon: <IconHeadphones_1 />,
    title: "Customer Support 24/7",
    description: "Instant access to Support",
  },
  {
    icon: <IconShoppingBag />,
    title: "100% Secure Payment",
    description: "We ensure your money is save",
  },
  {
    icon: <IconPackage />,
    title: "Money-Back Guarantee",
    description: "30 Days Money-Back Guarantee",
  },
];

export default function Featured() {
  return (
    <div className={style.container}>
      {feature.map((item, index) => (
        <div key={index} className={style.featuredItem}>
          <div className={style.icon}>{item.icon}</div>
          <div className={style.text}>
            <div className={style.title}>{item.title}</div>
            <div className={style.description}>{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
