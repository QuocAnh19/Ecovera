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
    image: Cate_1,
    title: "Fresh Fruit",
  },
  {
    image: Cate_2,
    title: "Fresh Vegetables",
  },
  {
    image: Cate_3,
    title: "Meat & Fish",
  },
  {
    image: Cate_4,
    title: "Snacks",
  },
  {
    image: Cate_5,
    title: "Beverages",
  },
  {
    image: Cate_6,
    title: "Beauty & Health",
  },
  {
    image: Cate_7,
    title: "Bread & Bakery",
  },
  {
    image: Cate_8,
    title: "Baking Needs",
  },
  {
    image: Cate_9,
    title: "Cooking",
  },
  {
    image: Cate_10,
    title: "Diabetic Food",
  },
  {
    image: Cate_11,
    title: "Dish Detergents",
  },
  {
    image: Cate_12,
    title: "Oil",
  },
];

export default function Categories() {
  return (
    <div className={`margin-auto ${style.categoriesContainer}`}>
      <div className={style.cateHeading}>
        <h3>Popular Categories</h3>
        <Button icon={<IconArrow />} className={style.btn}>
          View All
        </Button>
      </div>
      <div className={style.categoriesBox}>
        {categories.map((item, index) => (
          <div key={index} className={style.categoriesItem}>
            <img src={item.image} alt="" className={style.img} />
            <div className={style.title}>{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
