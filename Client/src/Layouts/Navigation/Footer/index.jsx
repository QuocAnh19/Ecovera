import { NavLink } from "react-router-dom";
import style from "./FooterNavigation.module.scss";

const myAccountLink = [
  {
    to: "/myAccount",
    subs: "My Account",
  },
  {
    to: "/orderHistory",
    subs: "Order History",
  },
  {
    to: "/shoppingCart",
    subs: "Shopping Cart",
  },
  {
    to: "/myAccount",
    subs: "My Account",
  },
];

const helpsLink = [
  {
    to: "/contact",
    subs: "Contact",
  },
  {
    to: "/faqs",
    subs: "Faqs",
  },
  {
    to: "/terms&Condition",
    subs: "Terms & Condition",
  },
  {
    to: "/privacyPolicy",
    subs: "Privacy Policy",
  },
];

const proxyLink = [
  {
    to: "/about",
    subs: "About",
  },
  {
    to: "/shop",
    subs: "Shop",
  },
  {
    to: "/product",
    subs: "Product",
  },
  {
    to: "/trackOrder",
    subs: "Track Order",
  },
];

const categoriesLink = [
  {
    to: "/fruit&Vegetables",
    subs: "Fruit & Vegetables",
  },
  {
    to: "/meat&Fish",
    subs: "Meat & Fish",
  },
  {
    to: "/bread&Bakery",
    subs: "Bread & Bakery",
  },
  {
    to: "/beauty&Health",
    subs: "Beauty & Health",
  },
];

export default function FooterNavigation() {
  return (
    <div className={style.container}>
      <div className={style.item}>
        <nav>
          <ul className={style.ulFooter}>
            <p>My Account</p>
            {myAccountLink.map((item, index) => (
              <li key={index} className={style.liFooter}>
                <NavLink to={item.to}>
                  {item.subs}
                </NavLink>
              </li>
            ))}
          </ul>
          <ul className={style.ulFooter}>
            <p>Helps</p>
            {helpsLink.map((item, index) => (
              <li key={index} className={style.liFooter}>
                <NavLink to={item.to}>
                  {item.subs}
                </NavLink>
              </li>
            ))}
          </ul>
          <ul className={style.ulFooter}>
            <p>Proxy</p>
            {proxyLink.map((item, index) => (
              <li key={index} className={style.liFooter}>
                <NavLink to={item.to}>
                  {item.subs}
                </NavLink>
              </li>
            ))}
          </ul>
          <ul className={style.ulFooter}>
            <p>Categories</p>
            {categoriesLink.map((item, index) => (
              <li key={index} className={style.liFooter}>
                <NavLink to={item.to}>
                  {item.subs}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
