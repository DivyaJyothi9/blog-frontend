import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

const BlogForm = ({ authorName = "", authorRole = "junior", authorYear = "", linkedin = "", onSubmit }) => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // Validation: check filled fields
    if (!title.trim() || !company.trim() || !content.trim()) {
      setMessage("All fields are required");
      setLoading(false);
      return;
    }

    // Debug log: show what values are being passed in
    console.log("Debug BlogForm values:", {
      authorName,
      authorRole,
      authorYear,
      linkedin,
      title,
      company,
      content,
    });

    // Validation: only senior, staff, or coordinator
    if (authorRole !== "staff" && authorRole !== "senior" && authorRole !== "coordinator") {
      setMessage("Only senior students, staff, or coordinators can post blogs");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        author_name: authorName || "",
        author_year: authorYear || "",
        author_role: authorRole || "",
        linkedin: linkedin || "",
        title,
        company,
        content,
      };

      // Debug log: show the exact payload being sent
      console.log("Posting blog payload:", payload);

      //const res = await axios.post("http://localhost:5000/api/blogs", payload);
      const res = await axios.post(`${API_URL}/blogs`, payload);

      setMessage(res.data.message || "Blog posted successfully!");
      setTitle("");
      setCompany("");
      setContent("");

      if (onSubmit) onSubmit(); // refresh blog list
    } catch (err) {
      setMessage(err.response?.data?.message || "Error posting blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center-form">
      <div className="blogform-container">
        <h2>Post a New Blog</h2>

        {message && (
          <div className={message.toLowerCase().includes("error") ? "msg-error" : "msg-success"}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Blog Title</label>
          <input
            id="title"
            type="text"
            placeholder="Ex: My Deloitte Interview Experience"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label htmlFor="company">Company</label>
          <input
            id="company"
            type="text"
            placeholder="Ex: Deloitte, Accenture, Infosys..."
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <label htmlFor="content">Your Experience</label>
          <textarea
            id="content"
            placeholder="Explain interview rounds, tips, what you learned..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
          />

          <button type="submit" className="btn-blue" disabled={loading}>
            {loading ? "Posting..." : "Post Blog"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;