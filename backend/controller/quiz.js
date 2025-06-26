const db = require("../models");

const Quiz = db.quizs;
const Question = db.questions;
const AnswerOption = db.answerOptions;
const QuizScore = db.quizScores;


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
                attributes: ['optionText', 'isCorrect', 'id'],
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

  exports.getStudentQuizStatus = async (req, res) => {
    const { studentId } = req.params;
    console.log(studentId)
    try {
      const quizzes = await db.quizs.findAll({
        include: [
          {
            model: db.courses,
            attributes: ['courseName']
          },
          {
            model: db.questions,
            include: [
              {
                model: db.studentAnswers,
                where: { studentId },
                required: false // allow quizzes with no answers yet
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
  
      const result = quizzes.map(quiz => {
        const hasAnswered = quiz.questions.some(q =>
          q.studentAnswers && q.studentAnswers.length > 0
        );
        return {
          id: quiz.id,
          title: quiz.title,
          startTime: quiz.startTime,
          endTime: quiz.endTime,
          course: quiz.course,
          hasAnswered
        };
      });
  
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  };


  exports.submitQuiz = async (req, res) => {
    const { answers } = req.body; // array: { questionId, selectedOptionId, studentId }
  
    if (!answers || answers.length === 0) {
      return res.status(400).json({ message: "No answers submitted." });
    }
  
    const {studentId} = answers[0];
    const questionIds = answers.map(ans => ans.questionId);
  
    try {
      const questions = await Question.findAll({
        where: { id: questionIds },
        include: [{ model: AnswerOption }],
      });
  
      const {quizId} = questions[0];
      let correctCount = 0;
  
      for (const ans of answers) {
        const selected = await AnswerOption.findByPk(ans.selectedOptionId);
        await StudentAnswer.create({
          questionId: ans.questionId,
          selectedOptionId: ans.selectedOptionId,
          studentId: ans.studentId,
        });
  
        if (selected?.isCorrect) {
          correctCount++;
        }
      }
  
      const totalQuestions = questions.length;
      const score = parseFloat(((correctCount / totalQuestions) * 100).toFixed(2));
  
      await QuizScore.create({
        quizId,
        studentId,
        score,
      });
  
      return res.status(200).json({ message: "Quiz submitted", score });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  exports.getStudentQuizResult = async (req, res) => {
    const { quizId, studentId } = req.params;
  
    try {
      // Fetch quiz
      const quiz = await Quiz.findByPk(quizId, {
        include: [
          { model: Course, attributes: ["courseName", "courseCode"] },
          {
            model: Question,
            include: [AnswerOption],
          },
        ],
      });
  
      if (!quiz) return res.status(404).json({ message: "Quiz not found" });
  
      const {questions} = quiz;
  
      // Fetch student answers for this quiz
      const studentAnswers = await StudentAnswer.findAll({
        where: {
          studentId,
          questionId: questions.map((q) => q.id),
        },
      });
  
      // Create a mapping of answered questionId to selectedOptionId
      const answerMap = {};
      studentAnswers.forEach((ans) => {
        answerMap[ans.questionId] = ans.selectedOptionId;
      });
  
      // Evaluate score
      let correctCount = 0;
      const totalQuestions = questions.length;
  
      const questionsWithAnswers = questions.map((q) => {
        const selectedOptionId = answerMap[q.id];
        const correctOption = q.answerOptions.find((opt) => opt.isCorrect);
        const isCorrect = selectedOptionId && selectedOptionId === correctOption?.id;
        if (isCorrect) correctCount++;
  
        return {
          id: q.id,
          questionText: q.questionText,
          answerOptions: q.answerOptions,
          selectedOptionId: selectedOptionId || null,
        };
      });
  
      const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  
      res.status(200).json({
        quiz: {
          title: quiz.title,
          course: quiz.course,
        },
        score,
        questions: questionsWithAnswers,
      });
    } catch (err) {
      console.error("Error retrieving student quiz result:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };