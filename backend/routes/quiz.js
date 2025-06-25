const router = require("express").Router();
const {createQuiz, getAllQuizzesWithDetails, getQuizByIdWithDetails} = require("../controller/quiz");


// Route to create a new quiz
router.post("/", createQuiz);
router.get("/", getAllQuizzesWithDetails);
router.get("/:id", getQuizByIdWithDetails);


module.exports = router;