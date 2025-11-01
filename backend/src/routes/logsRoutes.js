import express from "express";
import { Router } from "express";
import { getDroneLogsById } from "../services/serviceController.js";
import { createDroneLog } from "../services/serviceController.js";
const router = Router();

router.get("/:droneId", async (req, res) => {
  const { droneId } = req.params;
  const { page } = req.query;

  try {
    const droneLogs = await getDroneLogsById(droneId, parseInt(page) || 1);
    return res.json(droneLogs.items);
  } catch (e) {
    if (e instanceof Error) {
      return res.status(400).json({ message: e.message });
    } else if (e instanceof AxiosError) {
      return res.status(e.response?.status || 500).json({ message: e.message });
    } else {
      return res.status(500).json({ message: "Unknown error" });
    }
  }
});

router.post("/", async (req, res) => {
  const { drone_id, drone_name, country, celsius } = req.body;
  if (!drone_id || !drone_name || !country || celsius === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const payload = {
    drone_id,
    drone_name,
    country,
    celsius,
  };

  try {
    const resp = await createDroneLog(payload);
    return res.status(201).json({
      message: "Log entry created successfully",
      data: resp.data,
    });
  } catch (e) {
    if (e instanceof Error) {
      return res.status(400).json({ message: e.message });
    } else if (e instanceof AxiosError) {
      return res.status(e.response?.status || 500).json({ message: e.message });
    } else {
      return res.status(500).json({ message: "Unknown error" });
    }
  }
});

export { router as logsRoutes };
