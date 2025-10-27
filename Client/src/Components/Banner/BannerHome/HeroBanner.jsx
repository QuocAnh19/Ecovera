

import style from "./HeroBanner.module.scss";

import bannerBig from "../../../Assets/Image/Banner/ImgBannerBig.svg";
import bannerSmallOne from "../../../Assets/Image/Banner/ImgBannerSmallOne.svg";
import bannerSmallTwo from "../../../Assets/Image/Banner/ImgBannerSmallTwo.svg";

export default function HeroBanner() {
    return(
        <div className={`margin-auto ${style.container}`}>
            <div className={style.bannerBig}>
                <img src={bannerBig} alt="Image" />
            </div>
            <div className={style.bannerSmall}>
                <img src={bannerSmallOne} alt="" />
                <img src={bannerSmallTwo} alt="" />
            </div>
        </div>
    )
}