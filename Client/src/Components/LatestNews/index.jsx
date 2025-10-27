import { IconArrow } from "../../Assets";
import { ImgLatestNews_1, ImgLatestNews_2, ImgLatestNews_3 } from "../../Assets/Image/LatestNews";
import style from "./LatestNews.module.scss";

import Button from "../Button";

const blogCard = [
    {
        image: ImgLatestNews_1,
        description: "Curabitur porttitor orci eget neque accumsan venenatis. Nunc fermentum.",
    },
    {
        image: ImgLatestNews_2,
        description: "Eget lobortis lorem lacinia. Vivamus pharetra semper,",
    },
    {
        image: ImgLatestNews_3,
        description: "Maecenas blandit risus elementum mauris malesuada.",
    },
];

export default function LatestNews(){
    return(
        <div className={style.container}>
            <h5>Latest News</h5>
            <div className={style.item}>
                {blogCard.map((item, index) => (
                    <div key={index} className={style.blog}>
                        <img src={item.image} alt="" className={style.img}/>
                        <div className={style.content}>
                            <div className={style.description}>{item.description}</div>
                            <Button icon={<IconArrow/>} className={style.btnReadMore}>Read More</Button>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    )
}