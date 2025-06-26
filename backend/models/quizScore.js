// models/quizScore.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('quizScore', {
      score: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    });
  };
  