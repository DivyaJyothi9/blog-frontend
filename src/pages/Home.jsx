import React from "react";

export default function Home() {
  const placementData = [
    { year: "2020-21", eligible: 2315, placed: 2162, percentage: "93.39%" },
    { year: "2021-22", eligible: 2270, placed: 2124, percentage: "93.57%" },
    { year: "2022-23", eligible: 3382, placed: 3180, percentage: "94.03%" },
    { year: "2023-24", eligible: 3420, placed: 3220, percentage: "94.15%" },
    { year: "2024-25", eligible: 3662, placed: "3365★", percentage: "91.89★" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('./sathyabama.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "20px",
      }}
    >
      <div className="content-box" style={{ maxWidth: "700px", width: "100%" }}>
        <h2>About Sathyabama Institute of Science and Technology</h2>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <div>
            <strong>About:</strong>{" "}
            <a
              href="https://www.sathyabama.ac.in/"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#FFD700", textDecoration: "underline" }}
            >
              Visit Official Website
            </a>
          </div>
          <div>
            <strong>Placements Overview:</strong>{" "}
            <a
              href="https://www.sathyabama.ac.in/placements/overview"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#FFD700", textDecoration: "underline" }}
            >
              Check Placement Overview
            </a>
          </div>
          <div>
            <strong>Campus Life:</strong>{" "}
            <a
              href="https://www.sathyabama.ac.in/campus-life"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#FFD700", textDecoration: "underline" }}
            >
              Explore Campus Life
            </a>
          </div>
        </div>

        <h3 className="mt-6">Placement Summary (Last 5 Years)</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
          <thead>
            <tr style={{ backgroundColor: "rgba(255,215,0,0.2)" }}>
              <th style={{ border: "1px solid #fff", padding: "8px" }}>Year</th>
              <th style={{ border: "1px solid #fff", padding: "8px" }}># of Students Eligible/Registered</th>
              <th style={{ border: "1px solid #fff", padding: "8px" }}># of Students Placed</th>
              <th style={{ border: "1px solid #fff", padding: "8px" }}>% of Placement</th>
            </tr>
          </thead>
          <tbody>
            {placementData.map((row, idx) => (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "rgba(255,255,255,0.05)" : "transparent" }}>
                <td style={{ border: "1px solid #fff", padding: "8px" }}>{row.year}</td>
                <td style={{ border: "1px solid #fff", padding: "8px" }}>{row.eligible}</td>
                <td style={{ border: "1px solid #fff", padding: "8px" }}>{row.placed}</td>
                <td style={{ border: "1px solid #fff", padding: "8px" }}>{row.percentage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
