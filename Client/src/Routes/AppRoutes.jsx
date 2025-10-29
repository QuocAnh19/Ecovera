import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import Shop from "../Pages/Shop";
import Register from "../Pages/Register";
import SignIn from "../Pages/SignIn";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer";
import ShoppingCart from "../Components/ShoppingCart";
import CheckOut from "../Components/CheckOut";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>

          <Route path="/shoppingCart" element={<ShoppingCart />}></Route>
          <Route path="/checkout" element={<CheckOut />}></Route>

          <Route path="/register" element={<Register />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>

          <Route path="/shop" element={<Shop />}></Route>
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

// Add File PublicRoutes(Need SignIn), PrivateRoutes(No need SignIn)
