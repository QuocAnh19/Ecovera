import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import Shop from "../Pages/Shop";
import ShoppingCart from "../Components/ShoppingCart";

export default function AppRoutes() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/shoppingCart" element={<ShoppingCart />}></Route>
                <Route path="/shop" element={<Shop />}></Route>
            </Routes>
        </BrowserRouter>
    )
}


// Add File PublicRoutes(Need SignIn), PrivateRoutes(No need SignIn)