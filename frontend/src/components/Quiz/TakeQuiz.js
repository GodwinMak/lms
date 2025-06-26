import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { PRODUCTION_URL } from "../../utils/Api";

const QUESTIONS_PER_PAGE = 5;

const TakeQuiz = () => {
  const studentId = JSON.parse(localStorage.getItem("userData"))?.id; // Get studentId from local storage
  const { id } = useParams(); // quizId from URL
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`${PRODUCTION_URL}/quiz/${id}`);
        const quizData = res.data;

        const shuffledQuestions = [...quizData.questions].sort(() => Math.random() - 0.5);
        const questionsWithShuffledOptions = shuffledQuestions.map((q) => ({
          ...q,
          answerOptions: [...q.answerOptions].sort(() => Math.random() - 0.5),
        }));

        setQuiz({ ...quizData, questions: questionsWithShuffledOptions });
      } catch (err) {
        console.error("Error fetching quiz:", err);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleOptionSelect = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
        questionId: parseInt(questionId),
        selectedOptionId,
        studentId,
      }));
  
      await axios.post(`${PRODUCTION_URL}/quiz/submit`, { answers: payload });
  
      alert(`Quiz submitted successfully!`);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Submission failed");
    }
  };

  if (!quiz) return <div className="text-white p-6">Loading quiz...</div>;

  const totalQuestions = quiz.questions.length;
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
  const isReviewPage = currentPage === totalPages;

  const currentQuestions = isReviewPage
    ? quiz.questions
    : quiz.questions.slice(currentPage * QUESTIONS_PER_PAGE, (currentPage + 1) * QUESTIONS_PER_PAGE);

  const label = (i) => `(${String.fromCharCode(65 + i)})`;

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

        {currentQuestions.map((question, qIndex) => (
          <div key={question.id} className="mb-6 border border-gray-700 p-4 rounded">
            <h2 className="font-semibold mb-2">
              Q{quiz.questions.indexOf(question) + 1}. {question.questionText}
            </h2>
            <ul className="list-none space-y-2">
              {question.answerOptions.map((option, oIndex) => (
                <li key={option.id}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.id}
                      onChange={() => handleOptionSelect(question.id, option.id)}
                      checked={answers[question.id] === option.id}
                      autoComplete="off"
                      disabled={isReviewPage}
                    />
                    <span>
                      <span className="font-bold">{label(oIndex)}</span> {option.optionText}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Prev
          </button>

          {isReviewPage ? (
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={(currentPage + 1) > totalPages}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          )}
        </div>

        {isReviewPage && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Summary of Answers</h3>
            <ul className="space-y-1 text-gray-300">
              {quiz.questions.map((q, i) => (
                <li key={q.id}>
                  Q{i + 1}: {answers[q.id] ? `Answered` : `Not Answered`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;
