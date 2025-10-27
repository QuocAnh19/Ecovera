import { useEffect, useState } from "react";

import style from "./Products.module.scss";

import Button from "../Button";
import Tag from "../Tag";

import { IconArrow, IconCart } from "../../Assets";
// import {
//   Product_1,
//   Product_10,
//   Product_2,
//   Product_3,
//   Product_4,
//   Product_5,
//   Product_6,
//   Product_7,
//   Product_8,
//   Product_9,
// } from "../../Assets/Image/Product";

// const products = [
//   {
//     image: Product_1,
//     title: "Green Apple",
//     price: "$14.99",
//     tags: ["Sale 50%", "New"],
//   },
//   {
//     image: Product_2,
//     title: "Fresh Indian Malta",
//     price: "$20.00",
//   },
//   {
//     image: Product_3,
//     title: "FChinese cabbage",
//     price: "$12.00",
//   },
//   {
//     image: Product_4,
//     title: "Green Lettuce",
//     price: "$9.00",
//   },
//   {
//     image: Product_5,
//     title: "Eggplant",
//     price: "$34.00",
//   },
//   {
//     image: Product_6,
//     title: "Big Potatoes",
//     price: "$20.00",
//   },
//   {
//     image: Product_7,
//     title: "Corn",
//     price: "$20.00",
//   },
//   {
//     image: Product_8,
//     title: "Fresh Cauliflower",
//     price: "$12.00",
//   },
//   {
//     image: Product_9,
//     title: "Green Capsicum",
//     price: "$9.00",
//     tags: ["New"],
//   },
//   {
//     image: Product_10,
//     title: "Green Chili",
//     price: "$34.00",
//     tags: ["Sale 50%"],
//   },
// ];

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Gọi API từ backend
    fetch("http://localhost:5000/app/products")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  return (
    <div className={style.productsContainer}>
      <div className={style.productsHeading}>
        <h3>Popular Products</h3>
        <Button icon={<IconArrow />} className={style.btn}>
          View All
        </Button>
      </div>

      <div className={style.productsBox}>
        {products.map((item, index) => (
          <div key={index} className={style.productsItem}>
            <img
              src={`http://localhost:5000/uploads/${item.image}`}
              alt={item.title}
              className={style.img}
            />

            <div className={style.tagContainer}>
              {item.tags &&
                Array.isArray(item.tags) &&
                item.tags.map((tag, index) => (
                  <Tag key={index} type={tag}>
                    {tag}
                  </Tag>
                ))}
            </div>

            <div className={style.content}>
              <div className={style.left}>
                <div className={style.title}><p>{item.title}</p></div>
                <div className={style.price}>${item.price}</div>
              </div>
              <div className={style.right}>
                <Button size="circle" icon={<IconCart />} className={style.btnRight}></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
}
