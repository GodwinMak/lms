import React, {useState} from 'react'
import Sidebar from '../components/Siderbar'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom';

const Dashboard = ({darkMode,toggleDarkMode}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
}
  return (
    <>
      <Navbar  toggleDarkMode={toggleDarkMode} darkMode={darkMode} toggleSidebar={toggleSidebar}/>
      <Sidebar isSidebarOpen={isSidebarOpen}/>
      <Outlet/>
    </>
  )
}

export default Dashboard