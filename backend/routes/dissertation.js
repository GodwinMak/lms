const router = require('express').Router();
const upload = require("../middleware/upload");


const {createResearchProposal, getStudentProposals, getAllResearchProposals, updateResearchStatus} = require("../controller/dissertation");

router.post("/", upload.single("file"), createResearchProposal);
router.get("/", getAllResearchProposals);
router.get("/student/:studentId", getStudentProposals);
router.put("/update-status/:id", upload.single("feedbackFile"), updateResearchStatus);

module.exports = router;


