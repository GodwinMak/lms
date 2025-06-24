module.exports = (sequelize, DataTypes) => {
    return StudentAnswer = sequelize.define('studentAnswer', {
      selectedOptionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  };
  