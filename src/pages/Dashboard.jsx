import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [companyCount, setCompanyCount] = useState([]);
  const [companySentiment, setCompanySentiment] = useState([]);
  const [engagement, setEngagement] = useState([]);
  const [topLiked, setTopLiked] = useState([]);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countRes, sentimentRes, engagementRes, topLikedRes, timelineRes] =
          await Promise.all([
            axios.get("http://localhost:5000/api/analytics/company-count"),
            axios.get("http://localhost:5000/api/analytics/company-sentiment"),
            axios.get("http://localhost:5000/api/analytics/engagement"),
            axios.get("http://localhost:5000/api/analytics/top-liked"),
            axios.get("http://localhost:5000/api/analytics/timeline"),
          ]);

        setCompanyCount(countRes.data.data);
        setCompanySentiment(sentimentRes.data.data);
        setEngagement(engagementRes.data.data);
        setTopLiked(topLikedRes.data.data);
        setTimeline(timelineRes.data.data);
      } catch (err) {
        console.error("Error fetching analytics", err);
      }
    };
    fetchData();
  }, []);

  // Card style
  const cardStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    marginBottom: "30px",
    flex: 1,
  };

  // Grid row style
  const gridRowStyle = {
    display: "flex",
    gap: "30px",
    marginBottom: "30px",
    flexWrap: "wrap",
  };

  return (
    <div
      style={{
        backgroundImage: "url('/sathyabama.png')", // replace with actual image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "60px 0",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "maroon", // main box is maroon
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "yellow",
            marginBottom: "40px",
            fontSize: "2rem",
          }}
        >
          📊 Analytics Dashboard
        </h2>

        {/* Row 1: Blog Count + Sentiment */}
        <div style={gridRowStyle}>
          <div style={cardStyle}>
            <h3 style={{ color: "#2563eb", marginBottom: "15px" }}>
              Company-wise Blog Count
            </h3>
            <Bar
              data={{
                labels: companyCount.map((c) => c.company),
                datasets: [
                  {
                    label: "Blog Count",
                    data: companyCount.map((c) => c.count),
                    backgroundColor: "#2563eb",
                  },
                ],
              }}
            />
          </div>

          <div style={cardStyle}>
            <h3 style={{ color: "#2563eb", marginBottom: "15px" }}>
              Average Sentiment per Company
            </h3>
            <Bar
              data={{
                labels: companySentiment.map((c) => c.company),
                datasets: [
                  {
                    label: "Avg Compound Sentiment",
                    data: companySentiment.map((c) => c.avg_compound),
                    backgroundColor: "#10b981",
                  },
                ],
              }}
            />
          </div>
        </div>

        {/* Row 2: Likes/Dislikes + Timeline */}
        <div style={gridRowStyle}>
          <div style={cardStyle}>
            <h3 style={{ color: "#2563eb", marginBottom: "15px" }}>
              Likes vs Dislikes per Blog
            </h3>
            <Bar
              data={{
                labels: engagement.map((b) => b.title),
                datasets: [
                  {
                    label: "Likes",
                    data: engagement.map((b) => b.likes),
                    backgroundColor: "#2563eb",
                  },
                  {
                    label: "Dislikes",
                    data: engagement.map((b) => b.dislikes),
                    backgroundColor: "#dc2626",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
              }}
            />
          </div>

          <div style={cardStyle}>
            <h3 style={{ color: "#2563eb", marginBottom: "15px" }}>
              Blogs Posted per Month
            </h3>
            <Line
              data={{
                labels: timeline.map((t) => `${t.month}/${t.year}`),
                datasets: [
                  {
                    label: "Blogs Posted",
                    data: timeline.map((t) => t.count),
                    borderColor: "#f59e0b",
                    backgroundColor: "#fcd34d",
                  },
                ],
              }}
            />
          </div>
        </div>

        {/* Top Liked Blogs (full width) */}
        <div style={cardStyle}>
          <h3 style={{ color: "#2563eb", marginBottom: "15px" }}>
            Top 5 Most Liked Blogs
          </h3>
          <ul>
            {topLiked.map((b, i) => (
              <li key={i} style={{ marginBottom: "8px", color: "#333" }}>
                <strong>{b.title}</strong> ({b.company}) — 👍 {b.likes}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}