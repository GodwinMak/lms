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

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App