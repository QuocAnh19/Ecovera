import { useNavigate } from "react-router-dom";

import style from "./Categories.module.scss";

import Button from "../Button";

import {
  Cate_1,
  Cate_10,
  Cate_11,
  Cate_12,
  Cate_2,
  Cate_3,
  Cate_4,
  Cate_5,
  Cate_6,
  Cate_7,
  Cate_8,
  Cate_9,
} from "../../Assets/Image/Categories";
import { IconArrow } from "../../Assets/Icon";

const categories = [
  {
    id: "Fruits",
    image: Cate_1,
    title: "Fresh Fruit",
  },
  {
    id: "Vegetables",
    image: Cate_2,
    title: "Fresh Vegetables",
  },
  {
    id: "MeatFish",
    image: Cate_3,
    title: "Meat & Fish",
  },
  {
    id: "Snacks",
    image: Cate_4,
    title: "Snacks",
  },
  {
    id: "Beverages",
    image: Cate_5,
    title: "Beverages",
  },
  {
    id: "BeautyHealth",
    image: Cate_6,
    title: "Beauty & Health",
  },
  {
    id: "BreadBakery",
    image: Cate_7,
    title: "Bread & Bakery",
  },
  {
    id: "BakingNeeds",
    image: Cate_8,
    title: "Baking Needs",
  },
  {
    id: "Cooking",
    image: Cate_9,
    title: "Cooking",
  },
  {
    id: "DiabeticFood",
    image: Cate_10,
    title: "Diabetic Food",
  },
  {
    id: "DishDetergents",
    image: Cate_11,
    title: "Dish Detergents",
  },
  {
    id: "Oil",
    image: Cate_12,
    title: "Oil",
  },
];

export default function Categories({ onClick }) {
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/shop?category=${id}`);

    if (onClick) onClick(id);
  };

  return (
    <div className={`margin-auto ${style.categoriesContainer}`}>
      <div className={style.cateHeading}>
        <h3>Popular Categories</h3>
        <Button icon={<IconArrow />} className={style.btn}>
          View All
        </Button>
      </div>
      <div className={style.categoriesBox}>
        {categories.map((item) => (
          <div
            key={item.id}
            className={style.categoriesItem}
            onClick={() => handleClick(item.id)}
          >
            <img src={item.image} alt="" className={style.img} />
            <div className={style.title}>{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
