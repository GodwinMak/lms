import React, {useState} from 'react'
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Sign from './pages/Sign';
import Dashboard from './pages/Dashboard';
import {AuthProvider} from "./Context/AuthContext"
import Main from './components/Main';
import Course from './components/Course';
import CreateCourse from './components/Course/CreateCourse';
import CreateAssignment from './components/Assignment/CreateAssignement';
import ViewCourse from './components/Course/ViewCourse';
import UserProfile from './components/UserProfile';
import Student from './components/Student';
import EditStudent from './components/Student/EditStudent';
import Assignment from './components/Assignment';
import EditAssignment from './components/Assignment/EditAssignment';
import Answers from './components/Answers';
import AssignmentAnswersPage from "./components/Answers/AssignmentAnswersPage"
import Teacher from './components/Teacher';
import CreateQuiz from './components/Quiz/CreateQuiz';
import ViewQuiz from './components/Quiz/ViewQuiz';
import Quiz from './components/Quiz';
import TakeQuiz from './components/Quiz/TakeQuiz';
import AvailableQuiz from './components/Quiz/AvailableQuiz';
import PreviewQuiz from './components/Quiz/PreviewQuiz';
import EditQuiz from './components/Quiz/EditQuiz';
import CreateResearch from './components/Research/CreateResearch';
import StudentResearch from './components/Research/StudentResearch';
import TeacherUpdateResearch from './components/Research/TeacherUpdateResearch';

import CreateDissertation from "./components/Dissertation/CreateDissertation";
import StudentDissertation from "./components/Dissertation/StudentDissertation";
import TeacherUpdateDissertation from "./components/Dissertation/TeacherUpdateDissertation";

import CreateGrantWriting from "./components/GrantWriting/CreateGrantWriting";
import StudentGrantWriting from "./components/GrantWriting/StudentGrantWriting";
import TeacherUpdateGrantWriting from "./components/GrantWriting/TeacherUpdateGrantWriting";


const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [id, setId] = useState([])

  const toggleDarkMode = () => {  
        setDarkMode(!darkMode)
  }
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/signup' element={<Sign/>} />
          <Route path='/dashboard' element={<Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>}>
            <Route path="/dashboard" element={<Main setId={setId}/>} /> 
            <Route path='course' element={<Course/>} />
            <Route path='createCourse' element={<CreateCourse/>} />
            <Route path='createAssignment' element={<CreateAssignment/>} />
            <Route path='viewCourse/:id' element={<ViewCourse />} />
            <Route path='settings' element={<UserProfile/>} />
            <Route path='students' element={<Student/>}/>
            <Route path='editStudent/:id' element={<EditStudent/>}/>
            <Route path="assignment"  element={<Assignment/>}/>
            <Route path="editAssignment/:id"  element={<EditAssignment/>}/>
            <Route path="answers"  element={<Answers/>}/>
            <Route path="assignment/:assignmentId/answers" element={<AssignmentAnswersPage />} />
            <Route path='teacher' element={<Teacher/>} />
            <Route path= "quiz" element={<Quiz/>} />
            <Route path='create-quiz' element={<CreateQuiz/>} />
            <Route path='viewQuiz/:id' element={<ViewQuiz/>} />
            <Route path='takeQuiz/:id' element={<TakeQuiz/>} />
            <Route path= "availablequiz" element={<AvailableQuiz/>} />
            <Route path='previewQuiz/:id' element={<PreviewQuiz/>} />
            <Route path='editquiz/:id' element={<EditQuiz/>} />
            <Route path='create-research' element={<CreateResearch/>} />
            <Route path='research-proposal' element={<StudentResearch/>} />
            <Route path='researchteacher' element={<TeacherUpdateResearch/>} />

            <Route path='create-dissertation' element={<CreateDissertation/>} />
            <Route path='dissertation' element={<StudentDissertation/>} />
            <Route path='dissertationteacher' element={<TeacherUpdateDissertation/>} />

            <Route path='create-grantwriting' element={<CreateGrantWriting/>} />
            <Route path='research-proposal' element={<StudentGrantWriting/>} />
            <Route path='grantteacher' element={<TeacherUpdateGrantWriting/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App