import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { PRODUCTION_URL } from "../../utils/Api";

const AssignmentAnswersPage = () => {
  const { assignmentId } = useParams();

  console.log(assignmentId)
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    axios
      .get(`${PRODUCTION_URL}/answer/assignment/${assignmentId}/students-answers`)
      .then((res) => setAnswers(res.data))
      .catch((err) => console.error("Error fetching answers", err));
  }, [assignmentId]);

  const toggleSelect = (answerId) => {
    setSelected((prev) =>
      prev.includes(answerId)
        ? prev.filter((id) => id !== answerId)
        : [...prev, answerId]
    );
  };

  const downloadFile = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSelected = () => {
    const selectedDocs = answers.filter((a) => selected.includes(a.id));
    selectedDocs.forEach((ans) =>
      downloadFile(`${PRODUCTION_URL}/answer/uploads/${ans.answerDoc}`)
    );
  };

  return (
    <div className="p-6 sm:ml-64 mt-14 text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Student Answers</h2>

      {answers.length === 0 ? (
        <p>No answers submitted yet.</p>
      ) : (
        <>
          <table className="w-full table-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-left">Select</th>
                <th className="p-3 text-left">Student Name</th>
                <th className="p-3 text-left">Answer File</th>
                <th className="p-3 text-left">Download</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((ans) => (
                <tr key={ans.id} className="border-t dark:border-gray-700">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(ans.id)}
                      onChange={() => toggleSelect(ans.id)}
                    />
                  </td>
                  <td className="p-2">
                    {ans.user.firstName} {ans.user.lastName} ({ans.user.userId})
                  </td>
                  <td className="p-2">{ans.answerDoc}</td>
                  <td className="p-2">
                    <button
                      onClick={() =>
                        downloadFile(`${PRODUCTION_URL}/answer/uploads/${ans.answerDoc}`)
                      }
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex gap-3">
            <button
              onClick={downloadSelected}
              disabled={selected.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Download Selected ({selected.length})
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AssignmentAnswersPage;
