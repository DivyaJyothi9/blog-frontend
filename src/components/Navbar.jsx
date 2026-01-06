import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "";
  const role = (localStorage.getItem("role") || "").toLowerCase();
  const isLoggedIn = !!name;

  const canPostBlog = role === "staff" || role === "senior";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      {/* Left side: site title */}
      <h1>Sathyabama Career Chronicles</h1>

      {/* Right side: all links + user info */}
      <div className="navbar-right">
        <div className="navbar-links">
          <NavLink to="/" className="nav-item">Home</NavLink>
          <NavLink to="/blogs" className="nav-item">Blogs</NavLink>
          {isLoggedIn && canPostBlog && (
            <NavLink to="/post-blog" className="nav-item">Create Blog</NavLink>
          )}
          {/* NEW: Dashboard link */}
          {isLoggedIn && (
            <NavLink to="/dashboard" className="nav-item">Dashboard</NavLink>
          )}
          {!isLoggedIn && (
            <>
              <NavLink to="/login" className="nav-item">Login</NavLink>
              <NavLink to="/signup" className="nav-item">Sign Up</NavLink>
            </>
          )}
        </div>

        {isLoggedIn && (
          <div className="navbar-user">
            <span className="user-tag">Hi, {name}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}