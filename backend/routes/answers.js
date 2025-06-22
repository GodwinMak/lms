const router = require('express').Router();
const upload = require("../middleware/upload");


const {createAnswer, getAllAnswers, getAnswerById, updateAnswer, deleteAnswer, getAssignmentSubmissionsSummary} = require("../controller/answer")

router.post("/", upload.single("assignmentDoc"), createAnswer);
router.get("/", getAllAnswers);
router.get("/:id", getAnswerById);
router.delete("/:id", deleteAnswer);
router.put("/:id", upload.single("assignmentDoc"), updateAnswer);
// router.get("/assignment", getAssignmentSubmissionsSummary);

module.exports = router;