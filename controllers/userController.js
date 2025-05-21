const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/db");

exports.registerUser = async (req, res) => {
  const { userId, name, email, password, mobileNo, address } = req.body;
  const exists = db.users.find(u => u.userId === userId || u.email === email);
  if (exists) return res.status(409).json({ error: "User already exists" });

  const hashedPwd = await bcrypt.hash(password, 10);
  db.users.push({ userId, name, email, password: hashedPwd, mobileNo, address, isAdmin: false });
  res.status(201).json({ message: "User registered" });
};

exports.loginUser = async (req, res) => {
  const { userId, password } = req.body;
  const user = db.users.find(u => u.userId === userId);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.userId }, "secret", { expiresIn: "1h" });
  res.json({ token, user: { userId: user.userId, name: user.name, email: user.email } });
};

// const User = require("../models/User");
// //const Course = require("../models/Course");
// const bcrypt = require("bcrypt");
// // const auth = require("../auth");
// const jwt = require('jsonwebtoken');



// const users=[];
// module.exports.checkEmailExists = (reqBody) => {
// 	return User.find({ email: reqBody.email }).then(result => {

// 		// The "find" method returns a record if a match is found
// 		if(result.length > 0){
// 			return true;
// 			// No duplicate email found
// 			// The user is not yet registered in the database

// 		} else {
// 			return false;
// 		}
// 	})
// }

// module.exports.registerUser = async (req, res) => {
//   const { userId, name, email, password, mobileNo, address } = req.body;

//   const existingUser = users.find(u => u.email === email || u.userId === userId);
//   if (existingUser) {
//     return res.status(400).json({ message: "User already exists" });
//   }

//   try {
//     const hashedPwd = await bcrypt.hash(password, 10);
//     const user = { userId, name, email, password: hashedPwd, mobileNo, address, isAdmin: false };
//     users.push(user);
//     res.status(201).json({ message: "Registered successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// module.exports.loginUser = async (req, res) => {
//   const { userId, password } = req.body;

//   const user = users.find(u => u.userId === userId);
//   if (!user) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const match = await bcrypt.compare(password, user.password);
//   if (!match) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const token = jwt.sign(
//     { userId: user.userId, isAdmin: user.isAdmin },
//     "secret123", // For demo; ideally use process.env.JWT_SECRET
//     { expiresIn: '1h' }
//   );

//   res.json({
//     token,
//     user: { userId: user.userId, email: user.email, name: user.name }
//   });
// };



