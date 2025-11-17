import style from "./DashboardNavigation.module.scss";

import {
  IconDashBoard,
  IconLogOut,
  IconOrderHistory,
  IconSetting,
} from "../../../Assets";

const accountLink = [
  {
    id: "dashboard",
    icon: IconDashBoard,
    title: "Dashboard",
  },
  {
    id: "orderHistory",
    icon: IconOrderHistory,
    title: "Order History",
  },
  {
    id: "setting",
    icon: IconSetting,
    title: "Settings",
  },
  {
    id: "logOut",
    icon: IconLogOut,
    title: "Log-Out",
  },
];

export default function DashboardNavigation({ onSelect, active }) {
  return (
    <div className={style.container}>
      <div className={style.heading}>Navigation</div>
      {accountLink.map((item, index) => (
        <div
          key={index}
          className={`${style.item} ${active === item.id ? style.active : ""}`}
          onClick={() => onSelect(item.id)}
        >
          <div className={style.icon}>
            <item.icon />
          </div>
          <div className={style.title}>{item.title}</div>
        </div>
      ))}
    </div>
  );
}
