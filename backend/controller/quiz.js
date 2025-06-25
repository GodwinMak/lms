const db = require("../models");

const Quiz = db.quizs;
const Question = db.questions;
const AnswerOption = db.answerOptions;


exports.createQuiz = async (req, res) => {
    const { title, startTime, endTime, courseId, questions } = req.body;
  
    try {
      // Create quiz
      const quiz = await Quiz.create({
        title,
        startTime,
        endTime,
        courseId,
      });
  
      // Create questions and answer options
      for (const q of questions) {
        const question = await Question.create({
          questionText: q.text,
          quizId: quiz.id,
        });
  
        for (const option of q.options) {
          await AnswerOption.create({
            optionText: option.optionText,
            isCorrect: option.isCorrect,
            questionId: question.id,
          });
        }
      }
  
      res.status(201).json({ message: "Quiz created successfully", quizId: quiz.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create quiz" });
    }
  };


  exports.getAllQuizzesWithDetails = async (req, res) => {
    try {
      const quizzes = await Quiz.findAll({
        include: [
          {
            model: Course,
            attributes: ['id', 'courseName', 'courseCode'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });
  
      res.json(quizzes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve quizzes" });
    }
  };


  exports.getQuizByIdWithDetails = async (req, res) => {
    try {
      const quiz = await Quiz.findByPk(req.params.id, {
        include: [
          {
            model: Course,
            attributes: ['courseName', 'courseCode'],
          },
          {
            model: Question,
            include: [
              {
                model: AnswerOption,
                attributes: ['optionText', 'isCorrect'],
              },
            ],
          },
        ],
      });
  
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
  
      res.json(quiz);
    } catch (error) {
      console.error("Error retrieving quiz:", error);
      res.status(500).json({ error: "Failed to fetch quiz" });
    }
  };