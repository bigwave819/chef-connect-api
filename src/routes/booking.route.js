

import express from "express";
const router = express.Router();

import {
  createBooking,
  getBookings,
  updateBookingStatus,
  deleteBooking,
} from "../controller/booking.controller.js";

import ProtectedRoute from "../middleware/auth.middleware.js";

router.use(ProtectedRoute);


router.post("/create", createBooking);
router.get("/", getBookings);
router.put("/status/:id", updateBookingStatus);
router.delete("/:id", deleteBooking);

export default router;
