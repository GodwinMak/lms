import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { PRODUCTION_URL } from "../../utils/Api";

const TakeQuiz = ({ studentId }) => {
  const { id } = useParams(); // quizId from URL
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOptionId }

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`${PRODUCTION_URL}/quiz/${2}`);
        const quizData = res.data;

        // Shuffle questions
        const shuffledQuestions = [...quizData.questions].sort(
          () => Math.random() - 0.5
        );

        // Shuffle options inside each question
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
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const handleSubmit = async () => {
    try {
      const payload = Object.entries(answers).map(
        ([questionId, selectedOptionId]) => ({
          questionId: parseInt(questionId),
          selectedOptionId,
          studentId,
        })
      );

      await axios.post(`${PRODUCTION_URL}/quiz/submit`, { answers: payload });
      alert("Quiz submitted successfully!");
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Submission failed");
    }
  };

  if (!quiz) return <div className="text-white p-6">Loading quiz...</div>;

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

        {quiz.questions.map((question, qIndex) => {
          const label = (i) => `(${String.fromCharCode(65 + i)})`;
          return (
            <div
              key={question.id}
              className="mb-6 border border-gray-700 p-4 rounded"
            >
              <h2 className="font-semibold mb-2">
                Q{qIndex + 1}. {question.questionText}
              </h2>
              <ul className="list-none space-y-2">
                {question.answerOptions.map((option, oIndex) => (
                  // console.log("Options for question:", question.id, question.answerOptions)
                  <li key={option.id}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.id}
                        onChange={() =>
                          handleOptionSelect(question.id, option.id)
                        }
                        checked={answers[question.id] === option.id || false}
                        autoComplete="off"
                      />
                      <span>
                        <span className="font-bold">{label(oIndex)}</span>{" "}
                        {option.optionText}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default TakeQuiz;
