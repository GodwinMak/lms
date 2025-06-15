// models/Course.js
module.exports = (sequelize, DataTypes) => {
    return Course = sequelize.define("course", {
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });
};
