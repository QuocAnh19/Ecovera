
import style from "./Home.module.scss";

import Navbar from "../../Components/Navbar/Navbar";
import HeroBanner from "../../Components/Banner/BannerHome/HeroBanner";
import Featured from "../../Components/Featured";
import Categories from "../../Components/Categories";
import Products from "../../Components/Products";
import BannerSaleHome from "../../Components/Banner/BannerSaleHome";
import Footer from "../../Components/Footer";
import LatestNews from "../../Components/LatestNews";



export default function Home() {
  
  return (
    <div className={style.homeContainer}>
      <Navbar />
      <div className={`margin-auto ${style.homeContent}`}>
        <HeroBanner />
        <Featured />
        <Categories />
        <Products />
        <BannerSaleHome />
        <LatestNews />
      </div>
      <Footer />
    </div>
  );
}
