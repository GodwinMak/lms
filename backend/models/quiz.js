module.exports = (sequelize, DataTypes) => {
    return Quiz = sequelize.define('quiz', {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  };
  