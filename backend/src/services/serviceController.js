// โหลด dependencies แบบ CommonJS
import axios from "axios";
import { parseObject, parseLogObject } from "../utils/formatter.js";

export const getDroneConfig = async (droneId) => {
  if (!process.env.DRONE_CONFIG_URL)
    throw new Error("DRONE_CONFIG_URL is required");

  const resp = await axios.get(process.env.DRONE_CONFIG_URL);
  const data = resp.data.data;

  const drone = data.find((cfg) => cfg.drone_id === parseInt(droneId));
  return parseObject(drone);
};

export const getDroneLogsById = async (droneId, page = 1) => {
  if (!process.env.DRONE_LOG_URL) throw new Error("DRONE_LOG_URL is required");
  if (!process.env.DRONE_LOG_TOKEN)
    throw new Error("DRONE_LOG_TOKEN is required");

  const resp = await axios.get(
    `${process.env.DRONE_LOG_URL}?sort=-created,id&filter=(drone_id=${droneId})&perPage=12&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.DRONE_LOG_TOKEN}`,
      },
    }
  );
  const data = resp.data;
  const items = data.items.map((item) => parseLogObject(item)) || [];

  data.items = items;
  return data;
};

export const createDroneLog = async (logData) => {
  if (!process.env.DRONE_LOG_URL) throw new Error("DRONE_LOG_URL is required");
  if (!process.env.DRONE_LOG_TOKEN)
    throw new Error("DRONE_LOG_TOKEN is required");

  const resp = await axios.post(process.env.DRONE_LOG_URL, logData, {
    headers: {
      Authorization: `Bearer ${process.env.DRONE_LOG_TOKEN}`,
    },
  });
  return resp;
};
