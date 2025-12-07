import React from "react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import style from "./Products.module.scss";

import Button from "../Button";
import Tag from "../Tag";
import QuickView from "./QuickView";

import { IconArrow, IconCart } from "../../Assets";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // item click
  const [cartItems, setCartItems] = useState([]); // giỏ hàng

  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    const exist = cartItems.find((ci) => ci.id === item.id);
    if (exist) {
      setCartItems(
        cartItems.map((ci) =>
          ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
    setSelectedItem(null);
  };

  useEffect(() => {
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
        <Button
          icon={<IconArrow />}
          className={style.btn}
          onClick={() => {
            navigate("/shop");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          View All
        </Button>
      </div>

      <div className={style.productsBox}>
        {products.slice(0, 10).map((item, index) => {
          const hasSale = item.sale_price && item.sale_price !== null;
          return (
            <div
              key={index}
              className={style.productsItem}
              onClick={() => {setSelectedItem(item)
                console.log("Selected item:", item)
              }}
            >
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt={item.name}
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
                  <div className={style.title}>
                    <p>{item.name}</p>
                  </div>
                  <div className={style.price}>
                    {hasSale ? (
                      <>
                        <div className={style.salePrice}>
                          ${item.sale_price}
                        </div>
                        <div className={style.originalPrice}>
                          ${item.original_price}
                        </div>
                      </>
                    ) : (
                      <div className={style.salePrice}>
                        ${item.original_price}
                      </div>
                    )}
                  </div>
                </div>
                <div className={style.right}>
                  <Button
                    size="circle"
                    icon={<IconCart />}
                    className={style.btnRight}
                  ></Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <QuickView
          id={selectedItem.product_id}
          image={selectedItem.image}
          name={selectedItem.name}
          salePrice={selectedItem.sale_price}
          originalPrice={selectedItem.original_price}
          onClose={() => setSelectedItem(null)}
          onAddToCart={() => handleAddToCart(selectedItem)}
        />
      )}
    </div>
  );
}
