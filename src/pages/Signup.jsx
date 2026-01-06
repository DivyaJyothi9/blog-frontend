import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isEmail } from "../utils/validations";
import { API_URL } from "../config";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const deriveRole = (y) => {
    if (y === "1-2") return "junior";
    if (y === "3-4") return "senior";
    if (y === "staff") return "staff";
    return "junior";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMsg("");

    if (!name) return setFormMsg("Full Name is required");
    if (!year) return setFormMsg("Select Year / Staff");

    if (year === "staff") {
      if (!isEmail(email)) return setFormMsg("Valid email required");
    } else {
      if (!regNo) return setFormMsg("Registration Number required");
    }

    if (year === "3-4" && !linkedin)
      return setFormMsg("LinkedIn URL is required for 3rd/4th year");

    if (!password || password.length < 6)
      return setFormMsg("Password must be at least 6 characters");

    const role = deriveRole(year);

    const bodyData = {
      name,
      regNo: year !== "staff" ? regNo : null,
      email: year === "staff" ? email : null,
      password,
      year,
      linkedin: year === "3-4" ? linkedin : null,
      role,
    };

    setLoading(true);

    try {
      //const res = await fetch("http://localhost:5000/api/auth/signup", {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Save user info into localStorage immediately
        localStorage.setItem("name", data.name || name);
        localStorage.setItem("role", (data.role || role).toLowerCase());
        localStorage.setItem("year", (data.year || year).toLowerCase());
        localStorage.setItem("linkedin", data.linkedin || linkedin || "");

        // 🔄 Trigger App.jsx to reload user state
        window.dispatchEvent(new Event("storage"));

        setFormMsg("Account created successfully. Redirecting...");

        // ✅ Smooth navigation
        setTimeout(() => {
          navigate("/blogs");
        }, 1000);
      } else {
        setFormMsg(data.message || "Signup failed");
      }
    } catch (err) {
      setFormMsg("Server error. Try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center min-h-screen">
      <div className="container">
        <h2 className="text-center mb-4 text-xl font-bold">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Select Year / Staff</option>
            <option value="1-2">1st / 2nd Year</option>
            <option value="3-4">3rd / 4th Year</option>
            <option value="staff">Staff</option>
          </select>

          {year !== "staff" && (
            <input
              placeholder="Registration Number"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
            />
          )}

          {year === "staff" && (
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}

          {year === "3-4" && (
            <input
              placeholder="LinkedIn Profile URL"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {formMsg && <div className="msg-error">{formMsg}</div>}

          <button type="submit" disabled={loading} className="btn-blue">
            {loading ? "Creating account..." : "CREATE ACCOUNT"}
          </button>
        </form>
      </div>
    </div>
  );
}