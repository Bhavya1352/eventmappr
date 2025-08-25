import express from "express";
import {
	createEvent,
	getEvents,
	getEventById,
	updateEvent,
	deleteEvent
} from "../controllers/event.controller.js";

const router = express.Router();

router.post("/create", createEvent);
router.get("/", getEvents);
router.get("/:id", getEventById);
router.put("/update/:id", updateEvent);
router.delete("/delete/:id", deleteEvent);

export default router;
