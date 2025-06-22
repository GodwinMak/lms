const db = require("../models")

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const User = db.users;
// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { firstName, middleName, lastName, password, role, Id, } = req.body;
    

    let data;
    const dataCheck = await User.findOne({ where: { userId: Id } });
    if (dataCheck) return res.status(400).json({ error: "User ID already exists" });

    if(role === "student"){
      data = await User.findOne({ where: { userId: Id } });
      if (data) return res.status(400).json({ error: "Student ID already exists" });
    
    }else if(role === "teacher"){
        data = await User.findOne({ where: { userId : Id } });
        if (data) return res.status(400).json({ error: "Teacher ID already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user

    let user

    if(role === "student"){
      user = await User.create({
        firstName,
        middleName,
        lastName,
        password: hashedPassword,
        role,
        userId: Id || null,
      });
    }

    else if(role === "teacher"){
      user = await User.create({
        firstName,
        middleName,
        lastName,
        password: hashedPassword,
        role,
        userId: Id || null,
      });
    }
    
    const token = jwt.sign({ Id }, process.env.JWT_SECRET);
    res.status(201).json({ message: "User created successfully", token, user});
  } catch (error) {

    console.log(error)
    res.status(400).json({ error: error.message });
  }
};


exports.login = async(req,res) =>{
  try {
    const {Id, password,} = req.body;
  
   const user =  await User.findOne({ where: { userId: Id } });

   if(!user) {
    return res.status(404).json({ error: "User not found" });
   }

   if(user.status === "Not Allowed"){
    return res.status(403).json({ message: "User is not allowed to login" });
   }

   const validPassword = await bcrypt.compare(password, user.password);
   if (!validPassword) {
    return res.status(400).send({ message: "Invalid password" });
  }

  const token = jwt.sign({ Id }, process.env.JWT_SECRET);
  res.status(200).send({ message: "Login successful", token, user });
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
}

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get one user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    // const { firstName, middleName, lastName, password, role, studentId, teacherId } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const {password} = req.body;
    if(password){
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      req.body.password = hashedPassword;
    } 
    await user.update(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const {oldPassword, newPassword} = req.body
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid old password" });
    }
    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await user.update({ password: hashedNewPassword });
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ❌ Block specific userId
    if (user.userId === "2019-04-13686") {
      return res.status(403).json({ message: "Not allowed to update this user's status" });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ message: "Status updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};
