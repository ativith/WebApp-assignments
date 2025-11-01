import { useEffect, useState } from "react";
import { getDroneConfig } from "../services/api.js";

export default function DroneConfig() {
  const [drone, setDrone] = useState(null);
  const droneId = import.meta.env.VITE_DRONE_ID;

  useEffect(() => {
    const fetchConfig = async () => {
      const data = await getDroneConfig(droneId);
      setDrone(data);
    };
    fetchConfig();
  }, [droneId]);

  if (!drone) return <div>Loading...</div>;

  return (
    <div>
      <h2>Drone Config</h2>
      <p>Drone ID: {drone.drone_id}</p>
      <p>Drone Name: {drone.drone_name}</p>
      <p>Light: {drone.light}</p>
      <p>Country: {drone.country}</p>
    </div>
  );
}
