import { NavLink } from "react-router-dom"

import style from "./NavbarNavigation.module.scss"



const isActive = ({ isActive }) => (isActive ? style.active : "");

const NavItem = [
    {
        to: "/",
        title: "Home"
    },
    {
        to: "/shop",
        title: "Shop"
    },
    {
        to: "/pages",
        title: "Pages"
    },
    {
        to: "/blog",
        title: "Blog"
    },
    {
        to: "/aboutUs",
        title: "About Us"
    },
    {
        to: "/contactUs",
        title: "Contact Us"
    },
];

export default function NavbarNavigation() {
    return(
        <nav>
            <ul>
                {NavItem.map((item, index) => (
                    <li key={index}>
                        <NavLink className={isActive} to={item.to}>{item.title}</NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    )
}