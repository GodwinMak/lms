import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PRODUCTION_URL } from "../../utils/Api";

const AvailableQuizzes = () => {
  const data = JSON.parse(localStorage.getItem("userData"));
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(
          `${PRODUCTION_URL}/quiz/available/${data.id}`
        );
        const now = new Date();

        const quizList = res.data.map((quiz) => {
          const startTime = new Date(quiz.startTime); // assuming ISO string from backend
          const endTime = new Date(quiz.endTime);
          const previewTime = new Date(endTime.getTime() + 20 * 60 * 1000); // 20 minutes later

          let status = "Not Yet Available";
          let action = "Unavailable";


          if (now >= startTime && now <= endTime ) {
            status = "Open";
            action = "Take Quiz";
          } else if (now >= previewTime) {
            status = "Preview Available";
            action = "Preview";
          } else if (now > endTime) {
            status = "Closed";
            action = "Unavailable";
          }

          return {
            ...quiz,
            status,
            action,
          };
        });

        setQuizzes(quizList);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="text-gray-500 bg-gray-100 p-4 sm:ml-64 mt-14 dark:bg-gray-800 min-h-screen">
      <main className="px-4 sm:px-6 lg:px-8 pt-4">
        <h1 className="text-xl font-semibold text-white mb-4">
          Available Quizzes
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 text-white rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-700 text-left">
                  Course
                </th>
                <th className="py-2 px-4 border-b border-gray-700 text-left">
                  Title
                </th>
                <th className="py-2 px-4 border-b border-gray-700 text-left">
                  Start Time
                </th>
                <th className="py-2 px-4 border-b border-gray-700 text-left">
                  End Time
                </th>
                <th className="py-2 px-4 border-b border-gray-700 text-left">
                  Status
                </th>
                <th className="py-2 px-4 border-b border-gray-700 text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-gray-800">
                  <td className="py-2 px-4 border-b border-gray-700">
                    {quiz.course?.courseName}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    {quiz.title}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    {new Date(quiz.startTime).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    {new Date(quiz.endTime).toLocaleString()}
                  </td>
                  <td
                    className={`py-2 px-4 border-b border-gray-700 ${
                      quiz.status.includes("Preview")
                        ? "text-yellow-400"
                        : quiz.status === "Open"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {quiz.status}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    {quiz.action === "Take Quiz" ? (
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                        onClick={() =>
                          navigate(`/dashboard/takeQuiz/${quiz.id}`)
                        }
                      >
                        Take Quiz
                      </button>
                    ) : quiz.action === "Preview" ? (
                      <button
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
                        onClick={() =>
                          navigate(`/dashboard/previewQuiz/${quiz.id}`)
                        }
                      >
                        Preview Result
                      </button>
                    ) : (
                      <span className="text-gray-400">Unavailable</span>
                    )}
                  </td>
                </tr>
              ))}
              {quizzes.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-400">
                    No quizzes available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AvailableQuizzes;
