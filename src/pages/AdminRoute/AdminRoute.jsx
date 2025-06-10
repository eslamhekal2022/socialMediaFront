import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export function AdminRoute({ children }) {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    if (user && user.role !== "moderator" && user.role !== "admin") {
      navigate("/");
    }
  }, [user, token, navigate]);

  if (!user || !token || (user.role !== "admin" && user.role !== "moderator")) {
    return null;
  }

  return children;
}
