const router = require('express').Router();
const upload = require("../middleware/upload");


const {createAssignment, getAllAssignments, getAssignmentById, updateAssignment, deleteAssignment} = require("../controller/assignment")

router.post("/", upload.single("assignmentDoc"), createAssignment);
router.get("/", getAllAssignments);
router.get("/:id", getAssignmentById);
router.delete("/:id", deleteAssignment);
router.put("/:id", upload.single("assignmentDoc"), updateAssignment);

module.exports = router;