import React, {useState, useEffect} from "react";
import axios from "axios";
import { PRODUCTION_URL } from "../utils/Api";
import { useNavigate } from "react-router-dom";

const Main = ({setId}) => {
  const [data, setData] = useState([])

  const navigate = useNavigate();

  useEffect(() =>{

    const fetchData= async () =>{
      try {
        await axios.get(`${PRODUCTION_URL}/course`)
        .then(res => {
          setData(res.data)
        })
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

 
  const courses = React.useMemo(()=> {
    return data.map(course => ({
      id: course.id,
      title: course.courseName,
      description: `Course Code: ${course.courseCode}`
    }))
  })

  const handleView = (id) =>{
    navigate(`/dashboard/viewCourse/${id}`);
  }
  return (
    <div className="text-gray-700 bg-gray-100 p-4 sm:ml-64 mt-14 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-md transition-transform duration-300 transform hover:scale-105 hover:shadow-xl"
            onClick={() =>{handleView(course.id)}}
          >
            <h2 className="text-xl font-bold mb-2 dark:text-white">{course.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
