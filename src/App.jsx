import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/Layout/layout.jsx";
import Home from "./pages/home/Home.jsx";
import Register from "./pages/Register/Register.jsx";
import Login from "./pages/Login/Login.jsx";
import { toast,ToastContainer } from "react-toastify";
import {Provider} from 'react-redux';
import store from "./Redux/store.js";
import './i18n.js';
import { UserProvider } from "./context/userContext.jsx";
import AllUser from "./pages/AllUsers/AllUser.jsx";
import AddPost from "./pages/PostsSystem/CreatePosts.jsx";
import GetUserPosts from "./pages/PostsSystem/GetUserPosts.jsx";
import UserDet from "./pages/userDet/userDet.jsx";
import { PostProvider } from "./context/postContext.jsx";
import { SocketProvider } from "./context/socketContext.jsx";
import  socket  from "./services/socket.js";
import { useEffect } from "react";
import { NotificationProvider } from "./context/notifications.jsx";
import Notifications from "./pages/notifications/Notifications.jsx";
import SearchComponent from "./pages/Search/Search.jsx";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail.jsx";
import CheckEmail from "./pages/CheckEmail/CheckEmail.jsx";

const routers = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "AllUser", element: <AllUser /> },
      { path: "AddPost", element: <AddPost /> },
      { path: "UserPosts", element: <GetUserPosts /> },
      { path: "userDet/:id", element: <UserDet/> },
      { path: "notifications", element: <Notifications/> },
      { path: "search", element: <SearchComponent/> },
      { path: "CheckEmail", element: <CheckEmail/> },
      { path: "verify-email/:token", element: <VerifyEmail/> },

    ],
  },
]);

export default function App() {

useEffect(() => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (token && userId) {
    socket.emit("addUser", userId);
  }

const handleNotification = (data) => {
  const currentUserId = localStorage.getItem("userId");

  if (data.receiverId !== currentUserId) return; // ✋ الإشعار مش ليا

  const action =
    data.type === "like"
      ? "أعجب بمنشورك"
      : data.type === "comment"
      ? "علق على منشورك"
      : "قام بمتابعتك ";

  toast.info(`📢 ${data.senderName} ${action}`);
};

  // 🟢 تسجيل المستمعين
  socket.on("getNotification", handleNotification);
  socket.on("doComment", handleNotification); // نفس الدالة تشتغل على النوعين
  socket.on("getFollow", handleNotification); // نفس الدالة تشتغل على النوعين

  return () => {
    socket.off("getNotification", handleNotification);
    socket.off("doComment", handleNotification);
    socket.off("getFollow", handleNotification);
  };
}, []);



  return (
    <Provider store={store}>
        <UserProvider>
        <PostProvider>
        <SocketProvider>
        <NotificationProvider>
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
            </NotificationProvider>
            </SocketProvider>
            </PostProvider>
        </UserProvider>
    </Provider>
  );
}
