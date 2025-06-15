import React, { useEffect, useState } from "react";
import axios from "axios";
import { PRODUCTION_URL } from "../../utils/Api";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const ViewCourse = () => {
  const [course, setCourse] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${PRODUCTION_URL}/course/${id}`)
      .then((res) => setCourse(res.data))
      .catch((err) => console.error("Error loading course", err));
  }, [id]);

  const getTimeRemaining = (endTime) => {
    const now = dayjs();
    const end = dayjs(endTime);
    const diff = end.diff(now);

    if (diff <= 0) return "Expired";

    const d = dayjs.duration(diff);
    return `${d.days()}d ${d.hours()}h ${d.minutes()}m left`;
  };

  if (!course)
    return (
      <div className="text-gray-500 bg-gray-100 dark:bg-gray-800 p-4 sm:ml-64 mt-14 min-h-screen">
        Loading...
      </div>
    );

    const handleAnswerSubmit = async (e, assignmentId) => {
      e.preventDefault();
    
      const formData = new FormData();
      const file = e.target.assignmentDoc.files[0];
      const userData = JSON.parse(localStorage.getItem("userData"));
    
      if (!userData || !userData.id) {
        alert("User not logged in.");
        return;
      }
    
      formData.append("assignmentId", assignmentId);
      formData.append("courseId", course.id);
      formData.append("Id", userData.Id);
      formData.append("assignmentDoc", file);
    
      try {
        const res = await axios.post(`${PRODUCTION_URL}/answer`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Answer uploaded successfully.");
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload. Try again.");
      }
    };
    
  return (
    <div className="text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-900 p-4 sm:ml-64 mt-14 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">
        {course.courseName}{" "}
        <span className="text-lg text-gray-500">({course.courseCode})</span>
      </h2>

      <h3 className="text-2xl font-semibold mb-4">Assignments</h3>

      {course.Assignments && course.Assignments.length > 0 ? (
        <ul className="space-y-6">
          {course.Assignments.map((assignment) => (
            <li
              key={assignment.id}
              className="border p-6 rounded-xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xl font-bold">{assignment.title}</h4>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    assignment.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {assignment.status.toUpperCase()}
                </span>
              </div>

              <p className="text-sm mb-2 text-gray-700 dark:text-gray-300">
                {assignment.assignmentDescription}
              </p>

              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <p>
                  Start Time:{" "}
                  {dayjs(assignment.startTime).format("DD MMM YYYY, HH:mm")}
                </p>
                <p>
                  End Time:{" "}
                  {dayjs(assignment.endTime).format("DD MMM YYYY, HH:mm")}
                </p>
                <p className="mt-1 font-medium">
                  Time Remaining:{" "}
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {getTimeRemaining(assignment.endTime)}
                  </span>
                </p>
              </div>

              {assignment.status === "active" ? (
                <>
                  <a
                    href={`${PRODUCTION_URL}/assignment/uploads/${assignment.assignmentDoc}`}
                    download
                    className="inline-block mt-3 text-blue-600 dark:text-blue-400 underline hover:text-blue-800"
                  >
                    📄 Download Assignment
                  </a>

                  <form
                    onSubmit={(e) => handleAnswerSubmit(e, assignment.id)}
                    className="mt-4 space-y-3"
                  >
                    <p className="font-medium text-sm text-gray-700 dark:text-gray-300">
                      Submit your answer here:
                    </p>

                    <input
                      type="file"
                      name="assignmentDoc"
                      required
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                    />

                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow"
                    >
                      Upload Answer
                    </button>
                  </form>
                </>
              ) : (
                <p className="mt-4 text-sm text-gray-500">
                  Assignment is inactive. Submission and download disabled.
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 italic">
          No assignments available for this course.
        </p>
      )}
    </div>
  );
};

export default ViewCourse;
