// models/Answer.js
module.exports = (sequelize, DataTypes) => {
    return Answer = sequelize.define('answer', {
      answerDoc: {
        type: DataTypes.STRING,
        allowNull: false,
    } // store file path or URL
    });
  };