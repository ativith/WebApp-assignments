import { useEffect, useState } from "react";
import { getDroneLogs, getDroneConfig } from "../services/api.js";

export default function ViewLogs() {
  const [logs, setLogs] = useState([]);
  const [drone, setDrone] = useState(null);
  const [page, setPage] = useState(1);
  const droneId = import.meta.env.VITE_DRONE_ID;

  useEffect(() => {
    const fetchData = async () => {
      const logData = await getDroneLogs(droneId, page);
      setLogs(logData.items || []);
    };
    fetchData();
  }, [droneId, page]);

  if (!drone) return <div>Loading...</div>;

  return (
    <div>
      <h2>View Logs</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Created</th>
            <th>Country</th>
            <th>Drone ID</th>
            <th>Drone Name</th>
            <th>Celsius</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.created}>
              <td>{log.created}</td>
              <td>{log.country}</td>
              <td>{log.drone_id}</td>
              <td>{log.drone_name}</td>
              <td>{log.celsius}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>Page {page}</span>
        <button onClick={() => setPage(page + 1)} disabled={logs.length < 12}>
          Next
        </button>
      </div>
    </div>
  );
}
