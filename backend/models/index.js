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

// in your index.js or association file

db.users.hasMany(db.answers, { foreignKey: 'studentId' });
db.answers.belongsTo(db.users, { foreignKey: 'studentId' });

db.courses.hasMany(db.assignments, { foreignKey: 'courseId' });
db.assignments.belongsTo(db.courses, { foreignKey: 'courseId' });

db.courses.hasMany(db.answers, { foreignKey: 'courseId' });
db.answers.belongsTo(db.courses, { foreignKey: 'courseId' });

db.assignments.hasMany(db.answers, { foreignKey: 'assignmentId' });
db.answers.belongsTo(db.assignments, { foreignKey: 'assignmentId' });


db.sequelize.sync({force: false}).then(() => {})
.then(() => {
    console.log("Yes re-sync done.");
});

module.exports = db;