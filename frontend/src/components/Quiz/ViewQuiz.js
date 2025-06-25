import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { PRODUCTION_URL } from "../../utils/Api";

// Utility to shuffle array
const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

const ViewQuiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`${PRODUCTION_URL}/quiz/${id}`);
        const { data } = res;

        // Shuffle questions
        const shuffledQuestions = shuffleArray(data.questions).map(
          (question) => ({
            ...question,
            answerOptions: shuffleArray(question.answerOptions), // Shuffle options per question
          })
        );

        setQuiz({
          ...data,
          questions: shuffledQuestions,
        });
      } catch (err) {
        console.error("Error fetching quiz:", err);
      }
    };

    fetchQuiz();
  }, [id]);

  if (!quiz) return <div className="text-white p-6">Loading...</div>;

  const optionLabels = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 mt-14">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
        <p className="mb-1 text-gray-300">
          Course: {quiz.course.courseName} ({quiz.course.courseCode})
        </p>
        <p className="mb-4 text-gray-400">
          Start: {new Date(quiz.startTime).toLocaleString()} | End:{" "}
          {new Date(quiz.endTime).toLocaleString()}
        </p>

        {quiz.questions.map((question, index) => (
          <div
            key={question.id}
            className="mb-6 border border-gray-700 p-4 rounded"
          >
            <h2 className="font-semibold mb-2">
              Q{index + 1}. {question.questionText}
            </h2>
            <ul className="list-inside">
              {question.answerOptions.map((option, i) => {
                const label = String.fromCharCode(65 + i); // A = 65, B = 66, etc.
                return (
                  <li
                    key={i}
                    className={
                      option.isCorrect ? "text-green-400" : "text-white"
                    }
                  >
                    <span className="font-bold">({label})</span>{" "}
                    {option.optionText}{" "}
                    {option.isCorrect && (
                      <span className="text-green-500">(Correct)</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewQuiz;
