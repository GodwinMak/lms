const router = require('express').Router();
const upload = require("../middleware/upload");


const {createAnswer, getAllAnswers, getAnswerById, updateAnswer, deleteAnswer} = require("../controller/answer")

router.post("/", upload.single("assignmentDoc"), createAnswer);
router.get("/", getAllAnswers);
router.get("/:id", getAnswerById);
router.delete("/:id", deleteAnswer);
router.put("/:id", upload.single("assignmentDoc"), updateAnswer);

module.exports = router;