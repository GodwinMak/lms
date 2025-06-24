const dbConfig = require("../config/dbConfig.js");
const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB, 
    dbConfig.USER, 
    dbConfig.PASSWORD, { 
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

sequelize.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

const db ={};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.js")(sequelize, DataTypes);
db.courses = require("./course.js")(sequelize, DataTypes);
db.assignments = require("./Assignment.js")(sequelize, DataTypes);
db.answers = require("./Answer.js")(sequelize, DataTypes);
db.quizs = require("./quiz.js")(sequelize, DataTypes);
db.questions = require("./question.js")(sequelize, DataTypes);
db.answerOptions = require("./answerOptions.js")(sequelize, DataTypes);
db.studentAnswers = require("./studentAnswer.js")(sequelize, DataTypes);

// in your index.js or association file

db.users.hasMany(db.answers, { foreignKey: 'studentId' });
db.answers.belongsTo(db.users, { foreignKey: 'studentId' });

db.courses.hasMany(db.assignments, { foreignKey: 'courseId' });
db.assignments.belongsTo(db.courses, { foreignKey: 'courseId' });

db.assignments.hasMany(db.answers, { foreignKey: 'assignmentId' });
db.answers.belongsTo(db.assignments, { foreignKey: 'assignmentId' });

db.quizs.hasMany(db.questions, { foreignKey: 'quizId' });
db.questions.belongsTo(db.quizs, { foreignKey: 'quizId' });

db.questions.hasMany(db.answerOptions, { foreignKey: 'questionId' });
db.answerOptions.belongsTo(db.questions, { foreignKey: 'questionId' });

db.questions.hasMany(db.studentAnswers, { foreignKey: 'questionId' });
db.studentAnswers.belongsTo(db.questions, { foreignKey: 'questionId' });

db.users.hasMany(db.studentAnswers, { foreignKey: 'studentId' });
db.studentAnswers.belongsTo(db.users, { foreignKey: 'studentId' });


db.sequelize.sync({force: false}).then(() => {})
.then(() => {
    console.log("Yes re-sync done.");
});

module.exports = db;