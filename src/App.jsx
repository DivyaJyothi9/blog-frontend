import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Blog from "./pages/Blog.jsx";
import Dashboard from "./pages/Dashboard.jsx";

// Components
import Navbar from "./components/Navbar.jsx";
import BlogForm from "./components/BlogForm.jsx";
import BlogList from "./components/BlogList.jsx";
import BlogDetail from "./components/BlogDetail.jsx";

function App() {
  const [currentUser, setCurrentUser] = useState({
    name: "",
    role: "junior",
    year: "",
    linkedin: ""
  });

  // 🔄 reusable function to load user from localStorage
  const loadUser = () => {
    let name = localStorage.getItem("name") || "";
    let year = localStorage.getItem("year") || "";
    let linkedin = localStorage.getItem("linkedin") || "";
    let role = localStorage.getItem("role");

    if (!role) {
      if (year === "3-4") role = "senior";
      else if (year === "staff") role = "staff";
      else role = "junior";
    }

    setCurrentUser({
      name,
      role: role.toLowerCase(),
      year,
      linkedin
    });
  };

  useEffect(() => {
    loadUser();

    // Listen for localStorage changes or manual dispatch
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  console.log("CurrentUser in App.jsx:", currentUser);

  return (
    <>
      <Navbar user={currentUser} />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Blog list */}
          <Route
            path="/blogs"
            element={
              <BlogList
                currentUserRole={currentUser.role}
                currentUserName={currentUser.name}
              />
            }
          />

          {/* Blog form */}
          <Route
            path="/post-blog"
            element={
              <BlogForm
                authorName={currentUser.name}
                authorYear={currentUser.year}
                authorRole={currentUser.role}
                linkedin={currentUser.linkedin}
              />
            }
          />

          {/* Single blog view */}
          <Route path="/blogs/:id" element={<Blog currentUser={currentUser} />} />

          {/* BlogDetail page */}
          <Route
            path="/blogdetails/:id"
            element={
              <BlogDetail
                currentUserRole={currentUser.role}
                currentUserName={currentUser.name}
              />
            }
          />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </>
  );
}

export default App;