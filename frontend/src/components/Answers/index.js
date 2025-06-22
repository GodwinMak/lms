import React, { useEffect, useState, useMemo } from 'react'
import Table from "./Table"
import axios from 'axios'
import {PRODUCTION_URL} from "../../utils/Api"
import { useNavigate } from 'react-router-dom';


const Answers = () => {
  const [data, setData] = useState([])
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${PRODUCTION_URL}/answer/assignment`) // use your actual URL
        console.log(res.data)
        const formatted = res.data.map(item => ({
          courseName: item.course.courseName,
          assignmentName: item.title,
          numberOfStudent: item.answerCount,
          id: item.id
        }))
        setData(formatted)
      } catch (err) {
        console.error("Hello",err, `${PRODUCTION_URL}/answer/assignment`)
      }
    }
    fetchSummary()
  }, [])

  const columns = useMemo(() => [
    {
      Header: "Course Name",
      accessor: "courseName"
    },
    {
      Header: "Assignment Name",
      accessor: "assignmentName"
    },
    {
      Header: "Number Of Student",
      accessor: "numberOfStudent"
    },
    {
      Header: "Action",
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
            onClick={() => navigate(`/dashboard/assignment/${row.original.id}/answers`)}
          >
            View Answers
          </button>
        </div>
      ),
    }
  ], [])

  return (
    <div className="text-gray-500 bg-gray-100 p-4 sm:ml-64 lg:flex-row translate-all duration-300 mt-14 dark:bg-gray-800 min-h-screen">
      <main className="px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Answers</h1>
        </div>
        <div className="mt-6">
          <Table columns={columns} data={data} />
        </div>
      </main>
    </div>
  )
}

export default Answers
