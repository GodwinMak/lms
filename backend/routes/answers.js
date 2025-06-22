const router = require('express').Router();
const upload = require("../middleware/upload");


const {createAnswer, getAllAnswers, getAnswerById, updateAnswer, deleteAnswer, getAnswerAssignmentSummary, getStudentsAnswersByAssignment,downloadAssignment} = require("../controller/answer")

router.post("/", upload.single("assignmentDoc"), createAnswer);
router.get("/", getAllAnswers);
router.get('/assignment', getAnswerAssignmentSummary); // Get summary of answers by assignment
router.get("/assignment/:assignmentId/students-answers", getStudentsAnswersByAssignment)
router.get("/:id", getAnswerById);
router.delete("/:id", deleteAnswer);
router.put("/:id", upload.single("assignmentDoc"), updateAnswer);
router.get('/uploads/:filename', downloadAssignment);

module.exports = router;