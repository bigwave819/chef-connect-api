import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";

// Create a booking
export const createBooking = async (req, res) => {
  try {
    //  if (!req.user || !req.user._id) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }

    const { bookedUserId, service, date } = req.body;
    const userId = req.user._id;

    // Ensure bookedUser exists and is either chef or protocol
    const bookedUser = await User.findById(bookedUserId);
    if (!bookedUser) return res.status(404).json({ message: "User not found" });
    if (!["chef", "protocol"].includes(bookedUser.role)) {
      return res.status(400).json({ message: "You can only book a chef or protocol" });
    }

    const booking = await Booking.create({
      user: userId,
      bookedUser: bookedUserId,
      service,
      date,
    });

    res.status(201).json({ message: "Booking created", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get bookings
export const getBookings = async (req, res) => {
  try {
    const { role, _id } = req.user;

    let query = {};

    if (role === "user") {
      // Users see only their own bookings
      query.user = _id;
    } else if (role === "admin") {
      // Admin sees all bookings
      query = {};
    } else {
      // Chefs and protocol users see only bookings where they are booked
      query.bookedUser = _id;
    }

    const bookings = await Booking.find(query)
      .populate("user", "name email role")
      .populate("bookedUser", "name email role")
      .sort({ date: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update booking status (admin only)
export const updateBookingStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "accepted", "rejected", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking updated", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete booking (admin only)
export const deleteBooking = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
