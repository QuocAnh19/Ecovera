import React, { useEffect, useState } from "react";

import style from "./FreshFruit.module.scss";

import Button from "../../../Components/Button";
import Tag from "../../../Components/Tag";
import QuickView from "../../../Components/Products/QuickView";
import { IconCart } from "../../../Assets";

export default function FreshFruit() {
  const [products, setProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cartItems, setCartItems] = useState([]);

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
        const filteredProducts = data.filter(
          (item) => item.category_id === "CAT-0001"
        );
        setProducts(filteredProducts);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  return (
    <div className={style.container}>
      <div className={style.productsBox}>
        {products.slice(0, 15).map((item, index) => {
          const hasSale = item.sale_price && item.sale_price !== null;

          return (
            <div
              key={index}
              className={style.productsItem}
              onClick={() => setSelectedItem(item)}
            >
              <div className={style.imgBox}>
                <img
                  src={`http://localhost:5000/uploads/${item.image}`}
                  alt={item.name}
                  className={style.img}
                />
              </div>

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
          id={selectedItem.id}
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
