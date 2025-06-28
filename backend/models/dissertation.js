// models/ResearchProposal.js
module.exports = (sequelize, DataTypes) => {
    return ResearchProposal = sequelize.define("dissertation", {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      middleName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      educationLevel: {
        type: DataTypes.ENUM("Bachelor", "Masters", "PhD"),
        allowNull: false,
      },
      researchTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      filePath: {
        type: DataTypes.STRING, // Store uploaded file path
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Pending", "Panel Reviewal", "Reject for Amending", "Approved"),
        defaultValue: "Pending",
      },
      teacherFeedbackFile: {
        type: DataTypes.STRING,
        allowNull: true, // Only present when status = Reject for Amending
      },
    });
  
  };
  