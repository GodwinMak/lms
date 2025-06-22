const db = require("../models");
const { fn, col, literal } = require('sequelize');
const path = require('path');
const fs = require('fs');

const Answer = db.answers;
const User = db.users;
const Assignment = db.assignments;
const Course = db.courses;

exports.createAnswer = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.body;
    console.log(studentId);
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
    const answers = await Answer.findAll();
    res.json(answers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get answer by ID
exports.getAnswerById = async (req, res) => {
  try {
    const answer = await Answer.findByPk(req.params.id);
    if (!answer) return res.status(404).json({ error: "Answer not found" });
    res.json(answer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an answer
exports.updateAnswer = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.body;
    const answer = await Answer.findByPk(req.params.id);
    if (!answer) return res.status(404).json({ error: "Answer not found" });

    const answerDoc = req.file ? req.file.filename : answer.answerDoc;

    await answer.update({
      assignmentId,
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

// exports.getAnswerAssignmentSummary = async(req, res) =>{
//   try {
//     const data = await Assignment.findAll({
//       include: [{
//         model: Answer,
//         attributes: ['id', 'answerDoc'],
//         include: [{
//           model: User,
//           // attributes: ['id', 'name']
//         }]
//       },
//       {
//         model: Course,
//         attributes: ['id', 'courseName']
//       }
//     ],
//       attributes: ['id', 'assignmentDescription', 'startTime', 'endTime', "title"]
//     })

//     res.status(200).json(data)
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: error.message });
//   }
// }

exports.getAnswerAssignmentSummary = async (req, res) => {
  try {
    const data = await Assignment.findAll({
      attributes: [
        "id",
        "assignmentDescription",
        "startTime",
        "endTime",
        "title",
        [fn("COUNT", col("answers.studentId")), "answerCount"]
      ],
      include: [
        {
          model: Answer,
          attributes: [],
          include: [
            {
              model: User,
              attributes: []
            }
          ]
        },
        {
          model: Course,
          attributes: ["id", "courseName"]
        }
      ],
      group: ["id",],
      raw: false
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentsAnswersByAssignment = async (req, res) => {
  const { assignmentId } = req.params;

  try {
    const answers = await Answer.findAll({
      where: { assignmentId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'middleName', 'lastName', 'userId'],
        },
      ],
      attributes: ['id', 'answerDoc', 'studentId'],
    });

    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ message: "Failed to load answers", error: error.message });
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