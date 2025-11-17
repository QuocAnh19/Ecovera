import { NavLink } from "react-router-dom";

import style from "./NavbarNavigation.module.scss";
import { IconChevronDown } from "../../../Assets/Icon";

const isActive = ({ isActive }) => (isActive ? style.active : "");

const NavItem = [
  {
    to: "/",
    title: "Home",
    icon: <IconChevronDown />,
  },
  {
    to: "/shop",
    title: "Shop",
    icon: <IconChevronDown />,
  },
  {
    to: "/admin",
    title: "ADMIN",
  },
  {
    to: "/aboutUs",
    title: "About Us",
  },
  {
    to: "/contactUs",
    title: "Contact Us",
  },
];

export default function NavbarNavigation() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = user.role || "customer";

  const filteredNavItems = NavItem.filter(
    (item) => item.to !== "/admin" || role === "admin"
  );

  return (
    <nav>
      <ul>
        {filteredNavItems.map((item, index) => (
          <li key={index}>
            <NavLink className={isActive} to={item.to}>
              {item.title}  {item.icon} 
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
