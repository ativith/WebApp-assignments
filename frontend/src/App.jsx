<<<<<<< HEAD
=======
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const DRONE_ID = import.meta.env.VITE_DRONE_ID;

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export default function App() {
  const [config, setConfig] = useState(null);
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [newCelsius, setNewCelsius] = useState("");
  const [error, setError] = useState(null);
  const [nextDisabled, setNextDisabled] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  useEffect(() => {
    loadLogs(page);
  }, [config, page]);

  async function loadConfig() {
    setLoadingConfig(true);
    setError(null);
    try {
      const resp = await api.get(`/api/config/${DRONE_ID}`);
      setConfig(resp.data);
    } catch (e) {
      console.error(e);
      setError(
        (e.response && e.response.data && e.response.data.message) ||
          e.message ||
          "Failed to load config"
      );
    } finally {
      setLoadingConfig(false);
    }
  }

  async function loadLogs(pageNumber = 1) {
    // wait for config to be ready
    if (!config) return;
    setLoadingLogs(true);
    setError(null);
    try {
      const resp = await api.get(
        `/api/logs/${config.drone_id}?page=${pageNumber}`
      );
      // According to the provided backend, the route returns an array of items.
      const items = Array.isArray(resp.data)
        ? resp.data
        : resp.data.items || [];
      setLogs(items);
      // If less than 12 returned, no next page available
      setNextDisabled(items.length < 12);
    } catch (e) {
      console.error(e);
      setError(
        (e.response && e.response.data && e.response.data.message) ||
          e.message ||
          "Failed to load logs"
      );
      setLogs([]);
      setNextDisabled(true);
    } finally {
      setLoadingLogs(false);
    }
  }

  async function handleAddLog(e) {
    e.preventDefault();
    setError(null);
    if (newCelsius === "" || isNaN(Number(newCelsius))) {
      setError("Please enter a valid celsius value");
      return;
    }

    const payload = {
      drone_id: config.drone_id,
      drone_name: config.drone_name,
      country: config.country,
      celsius: Number(newCelsius),
    };

    try {
      await api.post(`/api/logs`, payload);
      setNewCelsius("");
      // After insert, reload first page so newest shows up
      setPage(1);
      await loadLogs(1);
    } catch (e) {
      console.error(e);
      setError(
        (e.response && e.response.data && e.response.data.message) ||
          e.message ||
          "Failed to create log"
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header / Config section */}
        <header className="bg-white rounded-2xl shadow p-4 md:p-6 mb-6">
          <h1 className="text-lg md:text-2xl font-semibold mb-2">
            Drone Dashboard
          </h1>
          {loadingConfig ? (
            <p>Loading config...</p>
          ) : error && !config ? (
            <p className="text-red-600">{error}</p>
          ) : config ? (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <InfoCard title="Drone ID" value={config.drone_id} />
              <InfoCard title="Drone name" value={config.drone_name} />
              <InfoCard title="Light" value={String(config.light)} />
              <InfoCard title="Country" value={config.country} />
            </div>
          ) : (
            <p>No config found</p>
          )}
        </header>

        {/* Main: logs list + add form */}
        <main className="grid grid-cols-1 lg:grid-cols-8 gap-6">
          <section className="lg:col-span-8 bg-white rounded-2xl shadow p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
              <h2 className="text-md md:text-lg font-medium">Logs</h2>
              <form className="flex items-center gap-2" onSubmit={handleAddLog}>
                <label className="sr-only">Celsius</label>
                <input
                  type="number"
                  step="0.1"
                  value={newCelsius}
                  onChange={(e) => setNewCelsius(e.target.value)}
                  placeholder="Celsius"
                  className="px-3 py-2 border rounded-lg w-28 md:w-36 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Add
                </button>
              </form>
            </div>

            {error && config ? (
              <p className="text-red-600 mb-2">{error}</p>
            ) : null}

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="text-left text-sm text-gray-600 border-b">
                    <th className="px-3 py-2">Created</th>
                    <th className="px-3 py-2">Country</th>
                    <th className="px-3 py-2">Drone ID</th>
                    <th className="px-3 py-2">Drone name</th>
                    <th className="px-3 py-2">Celsius</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingLogs ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-6 text-center">
                        Loading logs...
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-6 text-center">
                        No logs found
                      </td>
                    </tr>
                  ) : (
                    logs.map((r) => (
                      <tr
                        key={r.id || `${r.drone_id}-${r.created}`}
                        className="border-b last:border-b-0"
                      >
                        <td className="px-3 py-2 text-sm">
                          {formatDate(r.created)}
                        </td>
                        <td className="px-3 py-2 text-sm">{r.country}</td>
                        <td className="px-3 py-2 text-sm">{r.drone_id}</td>
                        <td className="px-3 py-2 text-sm">{r.drone_name}</td>
                        <td className="px-3 py-2 text-sm">{r.celsius}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center justify-between mt-4">
              <div>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded-lg border ${
                    page === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={nextDisabled}
                  className={`ml-2 px-3 py-1 rounded-lg border ${
                    nextDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Next
                </button>
              </div>

              <div className="text-sm text-gray-600">Page {page}</div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="info-card">
      <span className="title">{title}:</span>
      <span className="value">{value}</span>
    </div>
  );
}

function formatDate(raw) {
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleString();
  } catch (e) {
    return raw;
  }
}
