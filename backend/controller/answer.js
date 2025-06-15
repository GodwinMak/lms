const db = require("../models");

const Answer = db.answers;
const User = db.users;
const Assignment = db.assignments;
const Course = db.courses;

exports.createAnswer = async (req, res) => {
  try {
    const { assignmentId, courseId, Id } = req.body;
    const answerDoc = req.file ? req.file.filename : null;

    const answer = await Answer.create({
      assignmentId,
      courseId,
      Id,
      answerDoc,
    });

    res.status(201).json(answer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all answers
exports.getAllAnswers = async (req, res) => {
  try {
    const answers = await Answer.findAll({
      include: [User, Assignment, Course],
    });
    res.json(answers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get answer by ID
exports.getAnswerById = async (req, res) => {
  try {
    const answer = await Answer.findByPk(req.params.id, {
      include: [User, Assignment, Course],
    });
    if (!answer) return res.status(404).json({ error: "Answer not found" });
    res.json(answer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an answer
exports.updateAnswer = async (req, res) => {
  try {
    const { assignmentId, courseId, studentId } = req.body;
    const answer = await Answer.findByPk(req.params.id);
    if (!answer) return res.status(404).json({ error: "Answer not found" });

    const answerDoc = req.file ? req.file.filename : answer.answerDoc;

    await answer.update({
      assignmentId,
      courseId,
      studentId,
      answerDoc,
    });
    res.json(answer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an answer
exports.deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findByPk(req.params.id);
    if (!answer) return res.status(404).json({ error: "Answer not found" });

    await answer.destroy();
    res.json({ message: "Answer deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
