import React from "react";
import { useCartStore } from "../../../../store/useCartStore";
import { Button } from "../../../../components/common/Button/Button";
import { Icon } from "../../../../components/common/Icon/Icon";
import styles from "./ProductCard.module.scss";

export const ProductCard = ({ product = {} }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const rawPrice = product.price ?? product.sale_price ?? product.original_price ?? 0;
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(rawPrice);

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name || "Sản phẩm"}
          loading="lazy"
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title} title={product.name}>
          {product.name}
        </h3>
        <p className={styles.price}>{formattedPrice}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddToCart}
          className={styles.btn}
        >
          <Icon name="cart" size={16} /> Thêm vào giỏ
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
