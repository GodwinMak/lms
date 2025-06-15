// models/User.js
module.exports = (sequelize, DataTypes) => {
    return (User = sequelize.define("user", {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      middleName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("student", "teacher"),
        allowNull: false,
      },
      studentId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      teacherId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
    }));
  };
  