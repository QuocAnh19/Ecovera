import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useRef } from "react";

import style from "./Shop.module.scss";

import CategoryNavigation from "../../Layouts/Navigation/Category";
import Button from "../../Components/Button";
import Tag from "../../Components/Tag";
import QuickView from "../../Components/Products/QuickView";
import { IconCart } from "../../Assets";

import { useCart } from "../../ConText/CartContext";

export default function Shop() {
  const [activeSection, setActiveSection] = useState("Fruits");
  const [products, setProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { addToCart } = useCart();

  // Fetch tất cả sản phẩm
  useEffect(() => {
    fetch("http://localhost:5000/app/products")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeSection]);

  // Lọc theo Category ID
  const filteredProducts = products.filter((item) => {
    switch (activeSection) {
      case "Fruits":
        return item.category_id === "CAT-0001";
      case "Vegetables":
        return item.category_id === "CAT-0002";
      case "MeatFish":
        return item.category_id === "CAT-0003";
      case "Snacks":
        return item.category_id === "CAT-0004";
      case "Beverages":
        return item.category_id === "CAT-0005";
      case "BeautyHealth":
        return item.category_id === "CAT-0006";
      case "BreadBakery":
        return item.category_id === "CAT-0007";
      case "BakingNeeds":
        return item.category_id === "CAT-0008";
      case "Cooking":
        return item.category_id === "CAT-0009";
      case "DiabeticFood":
        return item.category_id === "CAT-0010";
      case "DishDetergents":
        return item.category_id === "CAT-0011";
      case "Oil":
        return item.category_id === "CAT-0012";
      default:
        return false;
    }
  });

  const [searchParams] = useSearchParams();
  // Set activeSection từ query param khi component mount hoặc param thay đổi
  useEffect(() => {
    const category = searchParams.get("category");
    if (category) setActiveSection(category);
  }, [searchParams]);

  // Pagination logic
  const indexOfFirst = (currentPage - 1) * itemsPerPage;
  const indexOfLast = currentPage * itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  // Handle Next/Prev
  const handleNext = () => {
    if (indexOfLast < filteredProducts.length) {
      setCurrentPage((prev) => prev + 1);
      productsContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      productsContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const productsContainerRef = useRef(null);

  return (
    <div className={style.container}>
      <div className={style.left}>
        <CategoryNavigation
          onSelect={(cat) => {
            setActiveSection(cat);
            setCurrentPage(1);
          }}
          active={activeSection}
        />
      </div>

      <div className={style.right}>
        <div className={style.productsBox} ref={productsContainerRef}>
          {currentProducts.map((item, index) => {
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
                  <div className={style.leftContent}>
                    <div className={style.title}>{item.name}</div>

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

                  <div className={style.rightContent}>
                    <Button
                      size="circle"
                      icon={<IconCart />}
                      className={style.btnRight}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                        console.log("Added to cart:", item);
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className={style.pagination}>
          <button
            className={style.pageBtn}
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            &#8592;
          </button>
          <button
            className={style.pageBtn}
            onClick={handleNext}
            disabled={indexOfLast >= filteredProducts.length}
          >
            &#8594;
          </button>
        </div>

        {selectedItem && (
          <QuickView
            product={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </div>
    </div>
  );
}
