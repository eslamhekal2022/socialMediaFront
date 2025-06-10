import React, { useState } from "react";
import "./adminPanel.css";
import { Link, Outlet } from "react-router-dom";

const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-container">

      <button className="menu-button" onClick={toggleSidebar}>
        ☰
      </button>
      
      <aside className={`sidebar ${sidebarOpen ? "show" : ""}`}>
        <ul>
          <li><Link to={""} onClick={() => setSidebarOpen(false)}> Dashboard </Link></li>
          <li><Link to={"AddItem"} onClick={() => setSidebarOpen(false)}> Add to item</Link></li>
          <li><Link to={"allProducts"} onClick={() => setSidebarOpen(false)}> All Products</Link></li>
          <li><Link to={"allOrders"} onClick={() => setSidebarOpen(false)}>AllOrders</Link></li>
          <li><Link to={"AllUser"} onClick={() => setSidebarOpen(false)}>All users</Link></li>
          <li><Link to={"GetContacts"} onClick={() => setSidebarOpen(false)}>GetContacts</Link></li>
        </ul>
      </aside>
      
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanel;
