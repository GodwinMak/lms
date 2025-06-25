import React, { useEffect, useState } from "react";
import Table from "./Table";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PRODUCTION_URL } from "../../utils/Api";

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`${PRODUCTION_URL}/quiz`);
      setQuizzes(res.data);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const columns = React.useMemo(() => [
    {
      Header: "Course Name",
      accessor: "course.courseName",
    },
    {
      Header: "Quiz Title",
      accessor: "title",
    },
    {
      Header: "Start Time",
      accessor: "startTime",
      Cell: ({ value }) => new Date(value).toLocaleString(),
    },
    {
      Header: "End Time",
      accessor: "endTime",
      Cell: ({ value }) => new Date(value).toLocaleString(),
    },
    {
      Header: "Action",
      Cell: ({ row }) => (
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          onClick={() => navigate(`/dashboard/viewQuiz/${row.original.id}`)}
        >
          View Quiz
        </button>
      ),
    },
  ], [navigate]);

  const data = React.useMemo(() => quizzes, [quizzes]);

  return (
    <div className="text-gray-500 bg-gray-100 p-4 sm:ml-64 lg:flex-row mt-14 dark:bg-gray-800 min-h-screen">
      <main className="px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-white">Quizzes List</h1>
        </div>
        <div className="mt-6">
          <Table columns={columns} data={data} />
        </div>
      </main>
    </div>
  );
};

export default Quiz;
