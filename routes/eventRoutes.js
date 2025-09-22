const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const filePath = path.join(__dirname, "../data/events.json");

// Helper functions
const readEvents = () => {
  try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath);
    // ❌ Your code had: JSON.parse(data  "[]");
    return JSON.parse(data.toString() || "[]");
  } catch {
    return [];
  }
};

const writeEvents = (events) => {
  fs.writeFileSync(filePath, JSON.stringify(events, null, 2));
};

// POST /api/events
router.post("/", (req, res) => {
  const { title, description, date, location, maxAttendees } = req.body;

  // ❌ Your code had: if (!title  !date  !location  !maxAttendees)
  if (!title || !date || !location || !maxAttendees) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // ❌ Your code had: if (isNaN(maxAttendees)  maxAttendees <= 0)
  if (isNaN(maxAttendees) || maxAttendees <= 0) {
    return res
      .status(400)
      .json({ error: "maxAttendees must be a positive integer" });
  }

  const newEvent = {
    eventId: "EVT-" + Date.now(),
    title,
    description: description || "",
    date,
    location,
    maxAttendees,
    currentAttendees: 0,
    status: "upcoming",
  };

  const events = readEvents();
  events.push(newEvent);
  writeEvents(events);

  res.status(201).json(newEvent);
});

// GET /api/events
router.get("/", (req, res) => {
  try {
    const events = readEvents();
    res.json(events);
  } catch {
    res.status(500).json({ error: "Error reading events file" });
  }
});

module.exports = router;
