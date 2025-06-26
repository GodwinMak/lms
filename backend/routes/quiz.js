const router = require("express").Router();
const {createQuiz, getAllQuizzesWithDetails, getQuizByIdWithDetails, getStudentQuizStatus, submitQuiz, getStudentQuizResult} = require("../controller/quiz");


// Route to create a new quiz
router.post("/", createQuiz);
router.post("/submit", submitQuiz);
router.get("/", getAllQuizzesWithDetails);
router.get("/:id", getQuizByIdWithDetails);
router.get('/available/:studentId',getStudentQuizStatus)
router.get('/:quizId/student/:studentId', getStudentQuizResult);


module.exports = router;