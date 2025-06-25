const express = require("express");
const cors = require("cors");


require("dotenv").config({path: "./.env"});

const app = express();

app.use(cors());


app.use(express.json());
app.use(express.urlencoded({extended: true}))


const UserRouter = require("./routes/user")
const CourseRouter = require("./routes/course");
const AnswerRouter =  require("./routes/answers");
const Assignment = require("./routes/assignment")
const QuizRouter = require("./routes/quiz");

app.use("/user", UserRouter)
app.use("/course", CourseRouter)
app.use("/answer", AnswerRouter)
app.use("/assignment", Assignment)
app.use("/quiz", QuizRouter)

const PORT  = process.env.PORT || 8081

app.listen(PORT, () =>{
    console.log(`Server is running on Port ${PORT}`)
})