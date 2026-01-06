import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // for "Read More" navigation

const BlogList = ({ currentUserRole, currentUserName }) => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [message, setMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error("Error fetching blogs", err);
      }
    };
    fetchBlogs();
  }, []);

  // Filter blogs by search term
  const filteredBlogs = blogs.filter((blog) =>
    [blog.title, blog.company, blog.content, blog.author_name]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Sort blogs
  const sortedBlogs = filteredBlogs.sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "company") return a.company.localeCompare(b.company);
    return 0;
  });

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = sortedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(sortedBlogs.length / blogsPerPage);

  return (
    <div className="content-box" style={{ maxWidth: "1000px", margin: "30px auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#FFD700" }}>
        All Blogs
      </h2>

      {/* Message Box */}
      {message && (
        <div
          style={{
            marginBottom: "15px",
            padding: "12px",
            borderRadius: "6px",
            backgroundColor: message.type === "success" ? "#10b981" : "#ef4444",
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {message.text}
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="Search blogs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "6px",
          marginBottom: "15px",
          border: "none",
        }}
      />

      {/* Sort */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: "8px", borderRadius: "6px" }}
        >
          <option value="title">Title</option>
          <option value="company">Company</option>
        </select>
      </div>

      {/* Blog Grid */}
      {currentBlogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="blog-grid">
          {currentBlogs.map((blog) => (
            <div
              key={blog._id || blog.title}
              className="blog-card"
              style={{
                background: "rgba(128,0,0,0.85)",
                color: "white",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ marginBottom: "10px", color: "#FFD700" }}>{blog.title}</h3>
              <p><b>Company:</b> {blog.company}</p>
              <p style={{ margin: "10px 0" }}>
                {blog.content.slice(0, 150)}...{" "}
                <Link to={`/blogdetails/${blog._id}`} style={{ color: "#ADD8E6" }}>Read More</Link>
              </p>
              <p><b>Author:</b> {blog.author_name} ({blog.author_role})</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
{/* Pagination Controls */}
<div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginTop: "20px",
  }}
>
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((prev) => prev - 1)}
    style={{
      width: "60px",          // fixed width
      height: "30px",         // fixed height
      borderRadius: "4px",
      border: "none",
      backgroundColor: currentPage === 1 ? "#9ca3af" : "#2563eb",
      color: "white",
      cursor: currentPage === 1 ? "not-allowed" : "pointer",
    }}
  >
    Prev
  </button>

  <button
    disabled
    style={{
      width: "80px",          // fixed width for page info
      height: "30px",
      borderRadius: "4px",
      border: "none",
      backgroundColor: "FFFACD",
      color: "black",
      fontWeight: "bold",
    }}
  >
    {currentPage}/{totalPages}
  </button>

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((prev) => prev + 1)}
    style={{
      width: "60px",          // fixed width
      height: "30px",
      borderRadius: "4px",
      border: "none",
      backgroundColor: currentPage === totalPages ? "#9ca3af" : "#2563eb",
      color: "white",
      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
    }}
  >
    Next
  </button>
</div>
</div>    
  );
};

export default BlogList;

