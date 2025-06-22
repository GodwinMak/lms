const db = require("../models");

const Answer = db.answers;
const User = db.users;
const Assignment = db.assignments;
const Course = db.courses;

exports.createAnswer = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.body;
    const answerDoc = req.file ? req.file.filename : null;

    const answer = await Answer.create({
      assignmentId,
      studentId,
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
      include: [ Assignment, Course],
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
      include: [Assignment, Course],
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


exports.getAssignmentSubmissionsSummary = async (req, res) => {
  try {
    console.log("heelo")
    const data = await Assignment.findAll({
      attributes: [
        'id',
        ['title', 'assignmentName'],
        // [db.Sequelize.fn('COUNT', db.Sequelize.col('answers.studentId')), 'numberOfStudent']
      ],
      // include: [
      //   {
      //     model: db.courses,
      //     attributes: [['courseName', 'courseName']]
      //   },
      //   // {
      //   //   model: db.answers,
      //   //   attributes: []
      //   // }
      // ],
      // group: ['assignment.id', 'course.id'],
      // raw: true,
      // nest: true
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal server error" });
  }
};