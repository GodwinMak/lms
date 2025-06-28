const db = require("../models");


const ResearchProposal = db.researchProposals;

exports.createResearchProposal = async (req, res) => {
    try {
      const {
        firstName,
        middleName,
        lastName,
        email,
        educationLevel,
        researchTitle,
        description,
        studentId, // assuming it's sent from frontend
      } = req.body;
  
      const file = req.file ? req.file.filename : null;

      console.log("Received file:", file);
  
      if (!file || !file.endsWith(".docx")) {
        return res.status(400).json({ message: "Only .docx files are allowed." });
      }
  
      const proposal = await ResearchProposal.create({
        firstName,
        middleName,
        lastName,
        email,
        educationLevel,
        researchTitle,
        description,
        filePath: file,
        studentId,
        status: "Pending",
      });
  
      res.status(201).json(proposal);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  };

exports.getAllResearchProposals = async (req, res) => {
  try {
    const proposals = await ResearchProposal.findAll({
      order: [["createdAt", "DESC"]],
    })

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 
  exports.getStudentProposals = async (req, res) => {
    try {
      const { studentId } = req.params;
      const proposals = await ResearchProposal.findAll({
        where: { studentId: studentId },
        order: [["createdAt", "DESC"]],
      });
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.updateResearchStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const updateData = { status };
  
      // Attach feedback file if status is rejection and a file is uploaded
      if (status === "Reject for Amending" && req.file) {
        updateData.teacherFeedbackFile = req.file.filename;
      }
  
      const [updatedCount] = await ResearchProposal.update(updateData, {
        where: { id },
      });
  
      if (updatedCount === 0) {
        return res.status(404).json({ message: "Research proposal not found or not updated" });
      }
  
      const updatedProposal = await ResearchProposal.findByPk(id);
      res.json(updatedProposal);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };