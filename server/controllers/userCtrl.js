const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userCtrl = {
  register: async (req, res) => {
    try {
      const {
        name,
        email,
        contact,
        collegename,
        branch,
        year,
        password,
        cpassword,
      } = req.body;

      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "The email already exists." });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password is atleast 6 characters long." });

      //Password Encryption
      const passwordHash = await bcrypt.hash(password, 10);
      const cpasswordHash = await bcrypt.hash(cpassword, 10);
      const newUser = new Users({  name,
        email,
        contact,
        collegename,
        branch,
        year, password: passwordHash,cpassword: cpasswordHash });

      //save mongodb
      await newUser.save();

      res.status(200).json({ msg: "User registered successfully!" });

      //Then create jsonwebtoken to authenticate
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });
      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  signin: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: `Please fill the data` });
      }
      const userLogin = await Users.findOne({ email: email });
      //userLogin gets the value of the document in which the email matches
      //(if the email matches with any email in the collection)
      if (userLogin) {
        const isMatch = await bcrypt.compare(password, userLogin.password);

        if (!isMatch) {
          res.status(400).json({ error: "Invalid credentials" });
        } else {
          // res.json("user signin successfully");
          // if login success, create access token and refresh token
          const accesstoken = createAccessToken({ id: userLogin._id });
          const refreshtoken = createRefreshToken({ id: userLogin._id });

          res.cookie("refreshtoken", refreshtoken, {
            httpOnly: true,
            path: "/user/refresh_token",
          });
          res.json({ accesstoken });
        }
      } else {
        res.status(400).json({ error: "Invalid credentials" });
      }
    } catch (err) {
      console.log(err);
    }
  },
  getusers: async (req, res) => {
    try {
      const users = await Users.find();
      res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "Please Login or Register" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (!rf_token)
          return res.status(400).json({ msg: "Please Login or Register" });

        const accesstoken = createAccessToken({ id: user.id });

        res.json({ accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  leaderboard: async(req,res)=>{
    try {
      const users = await Users.find().sort({level: -1, updatedAt: 1}).select(["-password","-cpassword","-email","-contact","-_id","-__v"]);
      res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  update: async (req, res) => {
    try {
      const id = req.user.id;
      const user = await Users.findById(id);
      const { name, email, password, level } = user;
      const newLevel = level + 1;
      await Users.findByIdAndUpdate(
        { _id: req.user.id },
        { name, email, password, level: newLevel }
      );

      res.json({ msg: "Updated level" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports = userCtrl;
