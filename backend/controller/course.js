const db = require("../models");

const Course = db.courses;

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseCode } = req.body;
    const course = await Course.create({ courseName, courseCode });
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const { courseName, courseCode } = req.body;
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    await course.update({ courseName, courseCode });
    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    await course.destroy();
    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
