const express = require("express");

const auth = require("../middleware/auth");
const bookingRouter = express.Router();
const Booking = require("../models/bookings");

bookingRouter.post("/registerbooking", auth, async (req, res) => {
  try {
    const { carName, days, rentPerDay } = req.body;
    if(req.user.role!=="customer"){
      return res.status(400).json({
        msg:"Only customers can book"
      })
    }
    const Days = Number(days);
    const RentPerDay = Number(rentPerDay);
    if (Days > 365 || RentPerDay > 2000) {
      return res.status(400).json({
        msg: "invalid inputs",
      });
    }
    const totalCost = RentPerDay * Days;
    const booking = await Booking.create({
      carName,
      days: Days,
      rentPerDay: RentPerDay,
      user: req.user.userId,
      totalCost,
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
      msg: "Error creating booking",
    });
  }
});

bookingRouter.get("/booking/all", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.userId,
    });
    res.status(201).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Failed to get all bookings",
    });
  }
});

bookingRouter.get("/preview/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    const totalCost = Number(booking.days) * Number(booking.rentPerDay);
    if (!booking) {
      return res.status(400).json({
        msg: "Booking not valid",
      });
    }
    return res.status(200).json({
      success: true,
      data: {
        id: booking._id,
        car_name: booking.carName,
        days: booking.days,
        rent_per_day: booking.rentPerDay,
        status: booking.status,
        totalCost: totalCost,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Failed to get the booking",
    });
  }
});

bookingRouter.get("/summarize", auth, async (req, res) => {
  try {
    const { summary } = req.query;

    if (summary === "true") {
      const user = req.user;

      const bookings = await Booking.find({ user: user.userId });

      const amountSpent = bookings
        .filter(
          (booking) =>
            booking.status === "booked" || booking.status === "completed"
        )
        .map((booking) => {
          return Number(booking.rentPerDay) * Number(booking.days);
        });

      const totalBookings = amountSpent.length;

      let totalAmountSpent = 0;
      for (let i = 0; i < amountSpent.length; i++) {
        totalAmountSpent += amountSpent[i];
      }

      return res.status(200).json({
        success: true,
        data: {
          userId: user.userId,
          username: user.username,
          totalBookings,
          totalAmountSpent,
        },
      });
    } else {
      return res.status(400).json({
        msg: "false summary",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Failed to get the summary",
    });
  }
});

bookingRouter.put("/booking/:id", auth, async (req, res) => {
  try {
    const { carName, days, rentPerDay, status } = req.body;
    if (!status && (!carName || !days || !rentPerDay)) {
      return res.status(400).json({
        msg: "Invalid inputs",
      });
    }
    const role = req.user.role;
    if (role === "customer") {
      return res.status(401).json({
        msg: "Only owner can update",
      });
    }
    const { id } = req.params;
    const currentUser=await Booking.findById(id);
    const userid=currentUser.user;
    const exist=User.findById(userid);
    if(!exist){
      return res.status(403).json({
        msg: "Booking does not belong to user",
      });
    }
    const booking = await Booking.findByIdAndUpdate(
      id,
      { carName, days, rentPerDay, status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({
        msg: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        message: "Booking updated successfully",
        booking: {
          id: booking._id,
          car_name: booking.carName,
          days: booking.days,
          rent_per_day: booking.rentPerDay,
          status: booking.status,
          totalCost: booking.totalCost,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Failed to get the booking",
    });
  }
});

bookingRouter.delete("/booking/:bookingId", auth, async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        msg: "Booking not found",
      });
    }

    if (String(booking.user) !== String(req.user.userId)) {
      return res.status(403).json({
        msg: "Booking does not belong to user",
      });
    }
    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({
      success: true,
      data: {
        message: "Booking deleted successfully",
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Failed to delete booking",
    });
  }
});

module.exports = bookingRouter;
