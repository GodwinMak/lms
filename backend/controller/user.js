const db = require("../models")

const bcrypt = require("bcrypt");

const User = db.users;
// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { firstName, middleName, lastName, password, role, studentId, teacherId } = req.body;
    

    let user;

    if(studentId){
      user = await User.findOne({ where: { studentId } });
      if (user) return res.status(400).json({ error: "Student ID already exists" });
    
    }else if(teacherId){
        user = await User.findOne({ where: { teacherId } });
        if (user) return res.status(400).json({ error: "Teacher ID already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    await User.create({
      firstName,
      middleName,
      lastName,
      password: hashedPassword,
      role,
      studentId: studentId || null,
      teacherId: teacherId || null
    });
    
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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
