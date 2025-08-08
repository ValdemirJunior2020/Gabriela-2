import React, { useState, useEffect } from "react";
import SearchTable from "./components/SearchTable";

const SPREADSHEET_ID = "1T5fmIkqsBQYMPfU-3Lx-JoLVPqesIBf1NOnQ2Zdg22I";
const RANGE = "Página1"; // ✅ get entire sheet dynamically
const API_KEY = "AIzaSyDxtFsynX7MLaTCJD64tzIqSk8XDm3s9l8";

export default function App() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(
        RANGE
      )}?key=${API_KEY}`
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.values) {
          setHeaders(json.values[0]);
          setData(json.values.slice(1)); // Skip header row
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sheet:", err);
        setLoading(false);
      });
  }, []);

  const filtered = data.filter((row) =>
    row[0]?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center text-success fw-bold">
        🔎 Search Google Sheet
      </h1>
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-center text-muted">Loading data…</p>
      ) : (
        <SearchTable data={filtered} headers={headers} />
      )}
    </div>
  );
}
