import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import BlogForm from "../components/BlogForm";

export default function Blog({ currentUser }) {
  const { role = "junior", name = "", year = "", linkedin = "" } = currentUser || {};

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Allow posting only for senior, staff, coordinator
  const canPostBlog = role === "staff" || role === "senior" || role === "coordinator";

  const fetchBlogs = async () => {
    try {
     // const res = await axios.get("http://localhost:5000/api/blogs");
     // fetch blogs
      const res = await axios.get(`${API_URL}/blogs`);
      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.error("Error fetching blogs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="flex-center flex-col min-h-screen">
      <div className="container" style={{ maxWidth: "700px" }}>
        <h2>Blogs</h2>

        {canPostBlog && (
          <BlogForm
            authorName={name}
            authorYear={year}
            authorRole={role}
            linkedin={linkedin}
            onSubmit={fetchBlogs}
          />
        )}

        <div style={{ marginTop: "30px" }}>
          {loading ? (
            <p>Loading blogs...</p>
          ) : blogs.length === 0 ? (
            <p>No blogs yet.</p>
          ) : (
            blogs.map((blog, idx) => (
  <div
    key={idx}
    className="content-box"
    style={{ marginBottom: "20px", textAlign: "left" }}
  >
    <h3>{blog.title}</h3>
    <p><strong>Company:</strong> {blog.company}</p>
    <p>{blog.content}</p>
    <p>
      <strong>Author:</strong> {blog.author_name} ({blog.author_role})
    </p>
    {blog.linkedin && (
      <p>
        <a
          href={blog.linkedin}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#ADD8E6" }}
        >
          LinkedIn Profile
        </a>
      </p>
    )}

   {/* Likes / Dislikes */}
<div style={{ marginTop: "10px" }}>
  <button
    disabled={
      localStorage.getItem(`liked-${blog._id}`) ||
      localStorage.getItem(`disliked-${blog._id}`)
    }
    onClick={async () => {
      // guard clause: prevent multiple requests
      if (
        localStorage.getItem(`liked-${blog._id}`) ||
        localStorage.getItem(`disliked-${blog._id}`)
      ) {
        return;
      }
      try {
       // await axios.post(`http://localhost:5000/api/blogs/${blog._id}/like`);
        // like blog
        await axios.post(`${API_URL}/blogs/${blog._id}/like`);
        setBlogs((prev) =>
          prev.map((b) =>
            b._id === blog._id ? { ...b, likes: (b.likes || 0) + 1 } : b
          )
        );
        localStorage.setItem(`liked-${blog._id}`, "true");
      } catch (err) {
        console.error("Error liking blog", err);
      }
    }}
    style={{
      marginRight: "10px",
      padding: "8px 12px",
      borderRadius: "6px",
      backgroundColor:
        localStorage.getItem(`liked-${blog._id}`) ||
        localStorage.getItem(`disliked-${blog._id}`)
          ? "#9ca3af" // grey if disabled
          : "#2563eb", // blue if active
      color: "white",
      border: "none",
      cursor:
        localStorage.getItem(`liked-${blog._id}`) ||
        localStorage.getItem(`disliked-${blog._id}`)
          ? "not-allowed"
          : "pointer",
    }}
  >
    👍 {blog.likes || 0}
  </button>

  <button
    disabled={
      localStorage.getItem(`liked-${blog._id}`) ||
      localStorage.getItem(`disliked-${blog._id}`)
    }
    onClick={async () => {
      if (
        localStorage.getItem(`liked-${blog._id}`) ||
        localStorage.getItem(`disliked-${blog._id}`)
      ) {
        return;
      }
      try {
       // await axios.post(`http://localhost:5000/api/blogs/${blog._id}/dislike`);
       // dislike blog
        await axios.post(`${API_URL}/blogs/${blog._id}/dislike`);
        setBlogs((prev) =>
          prev.map((b) =>
            b._id === blog._id ? { ...b, dislikes: (b.dislikes || 0) + 1 } : b
          )
        );
        localStorage.setItem(`disliked-${blog._id}`, "true");
      } catch (err) {
        console.error("Error disliking blog", err);
      }
    }}
    style={{
      padding: "8px 12px",
      borderRadius: "6px",
      backgroundColor:
        localStorage.getItem(`liked-${blog._id}`) ||
        localStorage.getItem(`disliked-${blog._id}`)
          ? "#9ca3af" // grey if disabled
          : "#6b7280", // grey tone if active
      color: "white",
      border: "none",
      cursor:
        localStorage.getItem(`liked-${blog._id}`) ||
        localStorage.getItem(`disliked-${blog._id}`)
          ? "not-allowed"
          : "pointer",
    }}
  >
    👎 {blog.dislikes || 0}
  </button>
</div>
  </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};