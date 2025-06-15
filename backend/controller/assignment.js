const db = require("../models");

const path = require('path');
const fs = require('fs');

const Assignment = db.assignments;
const Course = db.courses;

exports.createAssignment = async (req, res) => {
  try {
    const { courseId, startTime, endTime, assignmentDescription,title } = req.body;
    console.log(req.body)
    const assignmentDoc = req.file ? req.file.filename : null;

    const assignment = await Assignment.create({
      courseId,
      startTime,
      title,
      endTime,
      assignmentDoc,
      assignmentDescription,
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
};

// Get all assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({ include: Course });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id, {
      include: Course,
    });
    if (!assignment)
      return res.status(404).json({ error: "Assignment not found" });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an assignment
exports.updateAssignment = async (req, res) => {
    try {
      const { courseId, startTime, endTime, assignmentDescription } = req.body;
      const assignment = await Assignment.findByPk(req.params.id);
      if (!assignment) return res.status(404).json({ error: "Assignment not found" });
  
      const assignmentDoc = req.file ? req.file.filename : assignment.assignmentDoc;
  
      await assignment.update({
        courseId,
        startTime,
        endTime,
        assignmentDoc,
        assignmentDescription
      });
  
      res.json(assignment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

// Delete an assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment)
      return res.status(404).json({ error: "Assignment not found" });

    await assignment.destroy();
    res.json({ message: "Assignment deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.downloadAssignment = (req, res) => {
  const {filename} = req.params;
  const filePath = path.join(__dirname, '..', 'uploads', filename);

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'File not found' });
    }

    return res.download(filePath, filename); // Triggers browser download
  });
};