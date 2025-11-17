import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "../Pages/Home";
import Shop from "../Pages/Shop";
import Register from "../Pages/Register";
import SignIn from "../Pages/SignIn";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import ShoppingCart from "../Components/ShoppingCart";
import CheckOut from "../Components/CheckOut";
import AboutUs from "../Pages/AboutUs";
import Contact from "../Pages/Contact";
// import BreadcrumbsNavigation from "../Layouts/Navigation/Breadcrumbs";
import Admin from "../Pages/Admin";
import Dashboard from "../Pages/DashBoard";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      {/* <BreadcrumbsNavigation /> */}
      <main>
        <div style={{ marginTop: 200 }}>
          <Routes>
            <Route path="/" element={<Home />}></Route>

            <Route path="/shoppingCart" element={<ShoppingCart />}></Route>
            <Route path="/checkout" element={<CheckOut />}></Route>

            <Route path="/register" element={<Register />}></Route>
            <Route path="/signin" element={<SignIn />}></Route>

            <Route path="/shop" element={<Shop />}></Route>

            <Route path="/admin" element={<Admin />}></Route>

            <Route path="/dashboard" element={<Dashboard />}></Route>

            <Route path="/aboutUs" element={<AboutUs />}></Route>

            <Route path="/contactUs" element={<Contact />}></Route>
          </Routes>
        </div>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

// Add File PublicRoutes(Need SignIn), PrivateRoutes(No need SignIn)
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "../Pages/Home";
// import Shop from "../Pages/Shop";
// import Register from "../Pages/Register";
// import SignIn from "../Pages/SignIn";
// import Navbar from "../Components/Navbar";
// import Footer from "../Components/Footer";
// import ShoppingCart from "../Components/ShoppingCart";
// import CheckOut from "../Components/CheckOut";
// import AboutUs from "../Pages/AboutUs";
// import Contact from "../Pages/Contact";
// import Admin from "../Pages/Admin";
// import Dashboard from "../Pages/DashBoard";

// import PublicRoute from "./PublicRoute";
// import PrivateRoute from "./PrivateRoute";

// export default function AppRoutes() {
//   return (
//     <BrowserRouter>
//       <Navbar />
//       <main style={{ marginTop: "200px" }}>
//         <Routes>
//           {/* Public pages */}
//           <Route path="/" element={<Home />} />
//           <Route path="/shop" element={<Shop />} />
//           <Route path="/aboutUs" element={<AboutUs />} />
//           <Route path="/contactUs" element={<Contact />} />

//           {/* Pages needing sign-in (public) */}
//           <Route
//             path="/signin"
//             element={
//               <PublicRoute>
//                 <SignIn />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/register"
//             element={
//               <PublicRoute>
//                 <Register />
//               </PublicRoute>
//             }
//           />

//           {/* Private pages */}
//           <Route
//             path="/dashboard"
//             element={
//               <PrivateRoute>
//                 <Dashboard />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/admin"
//             element={
//               <PrivateRoute>
//                 <Admin />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/shoppingCart"
//             element={
//               <PrivateRoute>
//                 <ShoppingCart />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/checkout"
//             element={
//               <PrivateRoute>
//                 <CheckOut />
//               </PrivateRoute>
//             }
//           />
//         </Routes>
//       </main>
//       <Footer />
//     </BrowserRouter>
//   );
// }
