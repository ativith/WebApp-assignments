import { useState, useEffect } from "react";
import { getDroneConfig, createDroneLog } from "../services/api.js";

export default function TemperatureForm() {
  const [celsius, setCelsius] = useState("");
  const [drone, setDrone] = useState(null);
  const droneId = import.meta.env.VITE_DRONE_ID;

  useEffect(() => {
    const fetchDrone = async () => {
      const data = await getDroneConfig(droneId);
      setDrone(data);
    };
    fetchDrone();
  }, [droneId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!drone) return;
    await createDroneLog({
      drone_id: drone.drone_id,
      drone_name: drone.drone_name,
      country: drone.country,
      celsius: parseFloat(celsius),
    });
    setCelsius("");
    alert("Log submitted!");
  };

  if (!drone) return <div>Loading...</div>;

  return (
    <div>
      <h2>Temperature Log Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Temperature (°C):
          <input
            type="number"
            value={celsius}
            onChange={(e) => setCelsius(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit data</button>
      </form>
    </div>
  );
}
