const express = require("express");
const cors = require("cors");
const path = require("path");


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
const ResearchProposalRouter = require("./routes/researchProposal");
const DissertationRouter = require("./routes/dissertation");
const GrantWritingRouter = require("./routes/grantwriting");

app.use("/uploads", (req, res, next) => {
    if (req.path.endsWith(".docx")) {
      res.type("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    }
    next();
  });
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/user", UserRouter)
app.use("/course", CourseRouter)
app.use("/answer", AnswerRouter)
app.use("/assignment", Assignment)
app.use("/quiz", QuizRouter)
app.use("/research", ResearchProposalRouter)
app.use("/dissertation", DissertationRouter)
app.use("/grantwriting", GrantWritingRouter)

const PORT  = process.env.PORT || 8081

app.listen(PORT, () =>{
    console.log(`Server is running on Port ${PORT}`)
})