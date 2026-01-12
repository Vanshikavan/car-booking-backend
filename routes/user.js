const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/users");
const jwt = require("jsonwebtoken")
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, password,role } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        msg: "Enter values for all the fields.",
      });
    }
    const exist = await User.findOne({ username });
    let user;
    if (!exist) {
      const hashedpassword = await bcrypt.hash(password, 10);
      user = await User.create({
        username,
        password: hashedpassword,
        role
      });

    } else {
      return res.status(409).json({
        msg: "Username not unique",
      });
    }
    return res.status(201).json({
      success: true,
      data: {
        message: "User created successfully",
        userId: user._id,
      },
    });
  } catch (err) {
    return res.status(500).json({
      msg: "User not created",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(401).json({
        msg: "invalid inputs",
      });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        msg: "user does not exist",
      });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        msg: "incorrect password",
      });
    }
    const token= jwt.sign({
        userId:user._id,
        username,
        role:user.role
    },process.env.SECRET)
    res.status(200).json({
      success: true,
      data: {
        message: "Login successful",
        token,
      },
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Login failed",
    });
  }
});

module.exports = router;
