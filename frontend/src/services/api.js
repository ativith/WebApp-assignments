import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getDroneConfig = async (droneId) => {
  const resp = await axios.get(`${BASE_URL}/api/config/${droneId}`);
  return resp.data;
};

export const createDroneLog = async (logData) => {
  const resp = await axios.post(`${BASE_URL}/api/logs`, logData);
  return resp.data;
};

export const getDroneLogs = async (droneId, page) => {
  const resp = await axios.get(`${BASE_URL}/api/logs${droneId}&page=${page}`);
  return resp.data;
};
