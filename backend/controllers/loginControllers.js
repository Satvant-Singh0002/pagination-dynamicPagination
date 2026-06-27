const db = require("../utils/db-connection");
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          isPremiumUser: user.isPremiumUser,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "15min",
        },
      );
      return res.status(200).json({
        message: "user logged successfully",
        token:token
      });
    } else {
      res.status(401).json({
        message: "invalid credentials",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
    });
    console.log(error);
  }
};

module.exports = {
  login
};
