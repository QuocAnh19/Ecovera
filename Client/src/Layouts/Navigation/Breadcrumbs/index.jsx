import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import style from "./BreadcrumbsNavigation.module.scss";

import { IconChevronRight, IconHome, ImgBreadcrumbsNavigate } from "../../../Assets";

export default function BreadcrumbsNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  // Cắt URL thành các phần, ví dụ: /categories/vegetables → ["categories", "vegetables"]
  const paths = location.pathname.split("/").filter(Boolean);

  // Hàm format để in chữ đẹp hơn
  const formatLabel = (str) =>
    str
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <div className={style.container}>
      <img src={ImgBreadcrumbsNavigate} alt="" />
      <div className={style.item} onClick={() => navigate("/")}>
        <IconHome />
      </div>
      
      {/* Các phần còn lại */}
      {paths.map((part, index) => {
        const isLast = index === paths.length - 1;
        const pathTo = "/" + paths.slice(0, index + 1).join("/");

        return (
          <div key={index} className={style.item}>
            <IconChevronRight />
            <span
              className={!isLast ? style.link : style.current}
              onClick={() => !isLast && navigate(pathTo)}
              style={{ cursor: !isLast ? "pointer" : "default" }}
            >
              {formatLabel(part)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
