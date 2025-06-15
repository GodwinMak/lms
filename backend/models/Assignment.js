// models/Assignment.js
module.exports = (sequelize, DataTypes) => {
  return (Assignment = sequelize.define("Assignment", {
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    assignmentDoc: {
      type: DataTypes.STRING,
      allowNull: false,
    }, 
    // store file path or URL
    assignmentDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }));
};
