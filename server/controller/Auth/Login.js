const bcrypt = require("bcryptjs");
const { isValidEmail } = require("../../../helper/constant");
const jwt = require("jsonwebtoken");
const db = require("../../database");
require("dotenv").config();

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username) {
      res.status(401).json({ message: "Enter Username", status: false });
      return false;
    }
    if (!email) {
      res.status(401).json({ message: "Enter Email", status: false });
      return false;
    }
    if (!isValidEmail(email)) {
      res.status(401).json({ message: "Enter Valid Email", status: false });
      return false;
    }
    if (!password) {
      res.status(401).json({ message: "Enter Password", status: false });
      return false;
    }

    const sql = "select email from login where email=?";
    const result = await db(sql, [email]);

    if (!result) {
      return res
        .status(401)
        .json({ message: "Something went wrong", status: false });
    }

    if (result.length > 0) {
      return res.status(401).json({
        message: "Email id already Taken",
        status: false,
      });
    }
    let hashedPassword = await bcrypt.hash(password, 8);

    let data = { username: username, email: email, password: hashedPassword };
    const sqlQ = "insert into login set ?";
    const results = await db(sqlQ, [data]);
    if (!results) {
      return res
        .status(401)
        .json({ message: "Something went wrong", status: false });
    } else {
      const userdata = {
        username: username,
        email: email,
        password: hashedPassword,
        created_At: new Date(),
      };
      res.status(200).json({
        data: userdata,
        message: "User Registration Success",
        status: true,
      });
    }
  } catch (error) {
    if (error) {
      return res.status(500).json({ message: error, status: false });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(401).json({ message: "Enter Email", status: false });
  }
  if (!isValidEmail(email)) {
    return res
      .status(401)
      .json({ message: "Enter Valid Email", status: false });
  }
  if (!password) {
    return res.status(401).json({ message: "Enter Password", status: false });
  }

  const sql = "select * from login where email = ?";
  const result = await db(sql, [email]);

  if (result.length === 0) {
    return res.status(401).json({
      message: "Email not found",
      status: false,
    });
  } else {
    bcrypt.compare(password, result[0]?.password, (err, data) => {
      if (!data) {
        res.status(401).json({ message: "Incorrect Password", status: false });
        return false;
      }
      let tokenData = {
        userId: "12",
      };
      const token = jwt.sign(tokenData, "secret", {
        expiresIn: "10h",
      });

      if (token) {
        res.status(200).json({
          message: "Login Successfully",
          username: result[0]?.username,
          email: result[0]?.email,
          token: token,
          status: true,
        });
      }
    });
  }
};

const logout = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(401)
        .json({ message: "Email not provide", status: false });
    }
    const sql = "select * from login where email=?";
    const result = await db(sql, [email]);
    if (result.length <= 0) {
      return res.status(401).json({
        message: "Email not found",
        status: false,
      });
    } else {
      res.status(200).json({
        message: "Logout Successfully",
        status: true,
      });
    }
  } catch (error) {
    if (error) {
      return res.status(500).json({ message: error, status: false });
    }
  }
};

module.exports = {
  register,
  login,
  logout,
};
