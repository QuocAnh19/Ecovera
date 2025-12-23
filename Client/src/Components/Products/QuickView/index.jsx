import { useState } from "react";
import { useCart } from "../../../ConText/CartContext";

import style from "./QuickView.module.scss";

import Button from "../../Button";
import {
  IconLogoBrand,
  IconFacebook,
  IconInstagram,
  IconPinterest,
  IconTwitter,
} from "../../../Assets";
import QualitySelector from "../../QualitySelector";

export default function QuickView({ product, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    addToCart({
      ...product,
      product_id: product.product_id,
      price: product.sale_price || product.original_price,
      quantity,
    });

    onClose();
  };

  const hasSale =
    product.sale_price !== null && product.sale_price !== undefined;

  return (
    <div className={style.quickViewWrapper} onClick={onClose}>
      <div
        className={style.quickViewContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={style.quickViewBox}>
          <div className={style.imageBox}>
            <img
              src={`http://localhost:5000/uploads/${product.image}`}
              alt={product.name}
              className={style.img}
            />
          </div>

          <div className={style.content}>
            <div className={style.heading}>
              <div className={style.title}>
                <h4>{product.name}</h4>
              </div>
              <div className={style.price}>
                {hasSale ? (
                  <>
                    <div className={style.salePrice}>${product.sale_price}</div>
                    <div className={style.originalPrice}>
                      ${product.original_price}
                    </div>
                  </>
                ) : (
                  <div className={style.salePrice}>
                    ${product.original_price}
                  </div>
                )}
              </div>
            </div>

            <div className={style.brand}>
              <div className={style.brandBox}>
                <div className={style.left}>
                  <span>Brand:</span>
                  <IconLogoBrand />
                </div>

                <div className={style.right}>
                  <span>Share item:</span>
                  <Button
                    size="circleSocial"
                    fillCircle
                    icon={<IconFacebook />}
                  />
                  <Button
                    size="circleSocial"
                    fillCircle
                    icon={<IconTwitter />}
                  />
                  <Button
                    size="circleSocial"
                    fillCircle
                    icon={<IconPinterest />}
                  />
                  <Button
                    size="circleSocial"
                    fillCircle
                    icon={<IconInstagram />}
                  />
                </div>
              </div>

              <p>
                Class aptent taciti sociosqu ad litora torquent per conubia
                nostra, per inceptos himenaeos. Nulla nibh diam, blandit vel
                consequat nec, ultrices et ipsum. Nulla varius magna a consequat
                pulvinar.
              </p>
            </div>

            <div className={style.CTA}>
              <QualitySelector value={quantity} onChange={setQuantity} />
              <Button fill className={style.btnAdd} onClick={handleAdd}>
                Add to Cart
              </Button>
            </div>
          </div>

          <button className={style.btnClose} onClick={onClose}>
            x
          </button>
        </div>
      </div>
    </div>
  );
}
