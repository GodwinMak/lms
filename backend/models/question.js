module.exports = (sequelize, DataTypes) => {
    return Question = sequelize.define('question', {
      questionText: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  };
  