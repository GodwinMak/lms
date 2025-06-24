module.exports = (sequelize, DataTypes) => {
    return AnswerOption = sequelize.define('answerOption', {
      optionText: {
        type: DataTypes.STRING,
        allowNull: false, // e.g., "A. 2 + 2 = 4"
      },
      optionLabel: {
        type: DataTypes.STRING,
        allowNull: false, // e.g., "A", "B", "C", "D"
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    });
  };
  