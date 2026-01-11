const express = require("express");

const auth = require("../middleware/auth");
const bookingRouter = express.Router();
const Booking = require("../models/bookings");

bookingRouter.post("/booking", auth, async (req, res) => {
  try {
    const { carName, days, rentPerDay } = req.body;
    const Days=Number(days);
    const RentPerDay=Number(rentPerDay)
    if (Days > 365 || RentPerDay > 2000) {
      return res.status(400).json({
        msg: "invalid inputs",
      });
    }
    const totalCost = RentPerDay*Days;
    const booking = await Booking.create({
      carName,
      days: Days,
      rentPerDay: RentPerDay,
      user: req.user.userId,
    });
    return res.status(200).json({
      success: true,
      data: {
        message: "Booking created successfully",
        bookingId: booking._id,
        totalCost,
      },
    });
  } catch (err) {
    res.status(500).json({
        msg:"Error creating booking"
    })
  }
});

module.exports = bookingRouter;
