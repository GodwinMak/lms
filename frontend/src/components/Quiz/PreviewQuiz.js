import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { PRODUCTION_URL } from "../../utils/Api";

const PreviewQuiz = () => {
  const { id: quizId } = useParams(); // quizId from route
  const studentId = JSON.parse(localStorage.getItem("userData"))?.id;

  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(`${PRODUCTION_URL}/quiz/${quizId}/student/${studentId}`);
        setResults(res.data);
      } catch (err) {
        console.error("Failed to load quiz result", err);
      }
    };

    fetchResult();
  }, [quizId, studentId]);

  if (!results) return <div className="text-white p-6">Loading results...</div>;

  const label = (i) => `(${String.fromCharCode(65 + i)})`;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 mt-14">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{results.quiz.title}</h1>
        <p className="mb-1 text-gray-300">
          Course: {results.quiz.course.courseName} ({results.quiz.course.courseCode})
        </p>
        <p className="mb-4 text-gray-400">
          Score: <span className="text-green-400 font-semibold">{results.score}%</span>
        </p>

        {results.questions.map((q, index) => (
          <div key={q.id} className="mb-6 border border-gray-700 p-4 rounded">
            <h2 className="font-semibold mb-2">
              Q{index + 1}. {q.questionText}
            </h2>
            <ul className="list-none space-y-1">
              {q.answerOptions.map((opt, i) => {
                const isSelected = q.selectedOptionId === opt.id;
                const {isCorrect} = opt;
                const isWrongSelected = isSelected && !isCorrect;

                return (
                  <li
                    key={opt.id}
                    className={`px-3 py-1 rounded ${
                      isCorrect
                        ? "bg-green-700"
                        : isWrongSelected
                        ? "bg-red-700"
                        : isSelected
                        ? "bg-yellow-700"
                        : "bg-gray-800"
                    }`}
                  >
                    <span className="font-bold">{label(i)}</span> {opt.optionText}
                    {isCorrect && " ✅"}
                    {isWrongSelected && " ❌"}
                  </li>
                );
              })}
            </ul>
            {!q.answerOptions.find((opt) => opt.id === q.selectedOptionId)?.isCorrect && (
              <p className="text-sm text-gray-300 mt-2">
                Correct Answer:{" "}
                <span className="text-green-400">
                  {
                    q.answerOptions.find((opt) => opt.isCorrect)?.optionText
                  }
                </span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviewQuiz;
