import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const BlogDetail = ({ currentUserRole, currentUserName }) => {
  const { id } = useParams(); // blog ID from URL
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // ✅ Changed to /blogs/:id endpoint
        //const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        // fetch blog
        const res = await axios.get(`${API_URL}/blogs/${id}`);
        setBlog(res.data.blog);
      } catch (err) {
        setMessage("Error fetching blog");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    try {
      // ✅ Changed to /blogs/:id delete endpoint
      //const res = await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
      // delete blog
      const res = await axios.delete(`${API_URL}/blogs/${id}`, {
        data: {
          editor_name: currentUserName,
          editor_role: currentUserRole,
        },
      });
      setMessage(res.data?.message || "Blog deleted successfully!");
      setTimeout(() => navigate("/blogs"), 2000); // redirect after delete
    } catch (err) {
      setMessage(err.response?.data?.message || "Cannot delete blog");
    }
  };

  if (loading) return <p>Loading blog...</p>;
  if (!blog) return <p>Blog not found.</p>;

  return (
    <div className="content-box" style={{ maxWidth: "800px", margin: "30px auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#FFD700" }}>
        {blog.title}
      </h2>

      {message && (
        <div
          style={{
            marginBottom: "15px",
            padding: "12px",
            borderRadius: "6px",
            backgroundColor: "#ef4444",
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}

      <p><b>Company:</b> {blog.company}</p>
      <p style={{ margin: "15px 0" }}>{blog.content}</p>
      <p><b>Author:</b> {blog.author_name} ({blog.author_role})</p>

      {blog.linkedin && (
        <p>
          <a href={blog.linkedin} target="_blank" rel="noreferrer" style={{ color: "#ADD8E6" }}>
            LinkedIn Profile
          </a>
        </p>
      )}

    {/* Likes / Dislikes */}
{/* Likes / Dislikes */}
<div style={{ marginTop: "10px" }}>
  <button
    disabled={
      !!localStorage.getItem(`liked-${blog._id}`) ||
      !!localStorage.getItem(`disliked-${blog._id}`)
    }
    onClick={async () => {
      if (
        !!localStorage.getItem(`liked-${blog._id}`) ||
        !!localStorage.getItem(`disliked-${blog._id}`)
      ) {
        return;
      }
      try {
        const userId =
          localStorage.getItem("regNo") ||
          localStorage.getItem("email") ||
          localStorage.getItem("name"); // fallback if needed

        if (!userId) {
          alert("You must be logged in to like a blog");
          return;
        }

       // const res = await axios.post(
         // `http://localhost:5000/api/blogs/${blog._id}/like`,
         const res = await axios.post(
         `${API_URL}/blogs/${blog._id}/like`,
          { user_id: userId },
          { headers: { "Content-Type": "application/json" } }
        );

        setBlog((prev) => ({
          ...prev,
          likes: res.data.likes,
          dislikes: res.data.dislikes,
        }));
        localStorage.setItem(`liked-${blog._id}`, "true");
      } catch (err) {
        console.error("Error liking blog", err);
      }
    }}
    style={{
      marginRight: "10px",
      padding: "8px 12px",
      borderRadius: "6px",
      backgroundColor: "#2563eb", // ✅ always blue when active
      color: "white",
      border: "none",
      cursor:
        !!localStorage.getItem(`liked-${blog._id}`) ||
        !!localStorage.getItem(`disliked-${blog._id}`)
          ? "not-allowed"
          : "pointer",
    }}
  >
    👍 {blog.likes || 0}
  </button>

  <button
    disabled={
      !!localStorage.getItem(`liked-${blog._id}`) ||
      !!localStorage.getItem(`disliked-${blog._id}`)
    }
    onClick={async () => {
      if (
        !!localStorage.getItem(`liked-${blog._id}`) ||
        !!localStorage.getItem(`disliked-${blog._id}`)
      ) {
        return;
      }
      try {
        const userId =
          localStorage.getItem("regNo") ||
          localStorage.getItem("email") ||
          localStorage.getItem("name");

        if (!userId) {
          alert("You must be logged in to dislike a blog");
          return;
        }

       // const res = await axios.post(
         // `http://localhost:5000/api/blogs/${blog._id}/dislike`,
         const res = await axios.post(
           `${API_URL}/blogs/${blog._id}/dislike`,
          { user_id: userId },
          { headers: { "Content-Type": "application/json" } }
        );

        setBlog((prev) => ({
          ...prev,
          likes: res.data.likes,
          dislikes: res.data.dislikes,
        }));
        localStorage.setItem(`disliked-${blog._id}`, "true");
      } catch (err) {
        console.error("Error disliking blog", err);
      }
    }}
    style={{
      padding: "8px 12px",
      borderRadius: "6px",
      backgroundColor: "#6b7280", // ✅ grey for dislike
      color: "white",
      border: "none",
      cursor:
        !!localStorage.getItem(`liked-${blog._id}`) ||
        !!localStorage.getItem(`disliked-${blog._id}`)
          ? "not-allowed"
          : "pointer",
        
    }}
  >
    👎 {blog.dislikes || 0}
  </button>
</div>

{/* Delete button below */}
{(currentUserRole === "coordinator" || currentUserName === blog.author_name) && (
  <button
    onClick={handleDelete}   // ✅ no need to pass blog._id, you already have it in scope
    style={{
      marginTop: "20px",
      padding: "8px 12px",
      borderRadius: "6px",
      backgroundColor: "#b91c1c", // red
      color: "white",
      border: "none",
      cursor: "pointer",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
    }}
  >
    Delete
  </button>
)}

    </div>
  );
};

  export default BlogDetail;