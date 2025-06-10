import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/Layout/layout.jsx";
import Home from "./pages/home/Home.jsx";
import AdminPanel from "./pages/adminPanel/AdminPanel.jsx";
import Register from "./pages/Register/Register.jsx";
import Login from "./pages/Login/Login.jsx";
import Dashboard from "./pages/Dashboard/MainAdmin.jsx";
import AddItem from "./pages/AddItem/AddItem.jsx";
import AllProducts from "./pages/AllProducts/AllProducts.jsx";
import ProductDet from "./pages/ProductDetails/ProductDet.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { UserProvider } from "./context/userContext.jsx";
import { ToastContainer } from "react-toastify";
import CartComponent from "./pages/Cart/Cart.jsx";
import WishList from "./pages/WislIst/WishList.jsx";
import AllUser from "./pages/AllUsers/AllUser.jsx";
import UpdateRole from "./pages/UpdateRole/UpdateRole.jsx";
import { ProductProvider } from "./context/productContext.jsx";
import { Provider } from 'react-redux';
import store from "./Redux/store.js";

import SearchComponent from "./pages/Search/Search.jsx";
import GetCategories from "./pages/GetCategories/GetCategories.jsx";
import CheckoutPage from "./pages/CheckOut/CheckOut.jsx";
import AllOrders from "./pages/AllOrders/AllOrders.jsx";
import MyOrder from "./pages/MyOrder/MyOrder.jsx";
import { AdminRoute } from "./pages/AdminRoute/AdminRoute.jsx";
import { ProtectedRoute } from "./pages/ProtectedRoute/ProtectedRoute.jsx";
import AddReview from "./pages/AddUserReviews/addReview.jsx";
import UserDet from "./pages/userDet/userDet.jsx";
import OrderDet from "./pages/OrderDet/OrderDet.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import About from "./pages/About/About.jsx";
import GetContacts from "./pages/GetContacts/GetContacts.jsx";

import './i18n.js';

const routers = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: "/home", element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: "ProductDet/:id", element: <ProductDet /> },

      {
        path: "adminPanel",
        element: <AdminRoute><AdminPanel /></AdminRoute>,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "AddItem", element: <AddItem /> },
          { path: "allOrders", element: <AdminRoute><AllOrders /></AdminRoute> },
          { path: "allProducts", element: <AdminRoute><AllProducts /></AdminRoute> },
          { path: "AllUser", element: <AdminRoute><AllUser /></AdminRoute> },
          { path: "GetContacts", element: <AdminRoute><GetContacts /></AdminRoute> },
        ],
      },

      { path: "register", element: <Register /> },
      { path: "UserDet/:id", element: <UserDet /> },
      { path: "login", element: <Login /> },
      { path: "allProducts", element: <AllProducts /> },
      { path: "AddReview", element: <AddReview /> },
      { path: "Contact", element: <Contact /> },
      { path: "About", element: <About /> },

      { path: "cart", element: <CartComponent /> },
      { path: "WishList", element: <WishList /> },
      { path: "AllUser", element: <AdminRoute><AllUser /></AdminRoute> },
      { path: "UpdateRole/:id", element: <UpdateRole /> },
      { path: "search", element: <SearchComponent /> },
      { path: "GetCategories/:id", element: <GetCategories /> },
      { path: "Checkout", element: <CheckoutPage /> },
      { path: "meOrder", element: <MyOrder /> },
      { path: "OrderDet/:id", element: <OrderDet /> },
    ],
  },
]);

export default function App() {
  return (
    <Provider store={store}>
      <CartProvider>
        <UserProvider>
          <ProductProvider>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              toastClassName="custom-toast"
              bodyClassName="custom-toast-body"
            />
            <RouterProvider router={routers} />
          </ProductProvider>
        </UserProvider>
      </CartProvider>
    </Provider>
  );
}
