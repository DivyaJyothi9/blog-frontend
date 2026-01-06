import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isEmail } from "../utils/validations";

export default function Login() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState("");
  const [regNo, setRegNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMsg("");

    if (!loginType) return setFormMsg("Select Year / Staff");
    if (!password) return setFormMsg("Password required");

    let payload = { password };

    if (loginType === "staff") {
      if (!isEmail(email)) return setFormMsg("Valid email required");
      payload.email = email;
    } else {
      if (!regNo) return setFormMsg("Registration Number required");
      payload.regNo = regNo;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        const { role, name, year, linkedin } = data;

        localStorage.setItem("name", name || "");
        localStorage.setItem("role", (role || "").toLowerCase());

        // ✅ If backend returns year/linkedin, save them too
        if (year) localStorage.setItem("year", year.toLowerCase());
        if (linkedin) localStorage.setItem("linkedin", linkedin);

        // 🔄 Trigger App.jsx to reload user state
        window.dispatchEvent(new Event("storage"));

        setFormMsg("Login successful. Redirecting...");

    setTimeout(() => {
      navigate("/blogs"); // ✅ smooth navigation
      }, 1000);
      } else {
        setFormMsg(data.message || "Login failed");
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
        <h2 className="text-center mb-4 text-xl font-bold">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="loginType">Select Year / Staff</label>
          <select
            id="loginType"
            value={loginType}
            onChange={(e) => setLoginType(e.target.value)}
          >
            <option value="">Select Year / Staff</option>
            <option value="1-2">1st / 2nd Year</option>
            <option value="3-4">3rd / 4th Year</option>
            <option value="staff">Staff</option>
          </select>

          {loginType !== "staff" && (
            <>
              <label htmlFor="regNo">Registration Number</label>
              <input
                id="regNo"
                placeholder="Registration Number"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
              />
            </>
          )}
          {loginType === "staff" && (
            <>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </>
          )}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {formMsg && <div className="msg-error">{formMsg}</div>}

          <button type="submit" disabled={loading} className="btn-blue">
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}