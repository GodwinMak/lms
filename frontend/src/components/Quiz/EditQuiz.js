import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { PRODUCTION_URL } from "../../utils/Api";

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [quiz, setQuiz] = useState({
    title: "",
    startTime: "",
    endTime: "",
    courseId: "",
  });
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, courseRes] = await Promise.all([
          axios.get(`${PRODUCTION_URL}/quiz/${id}`),
          axios.get(`${PRODUCTION_URL}/course/`),
        ]);

        console.log(quizRes.data)

        setQuiz({
          title: quizRes.data.title,
          startTime: quizRes.data.startTime,
          endTime: quizRes.data.endTime,
          courseId: quizRes.data.courseId,
        });

        setQuestions(quizRes.data.questions);
        setCourses(courseRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index].text = e.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex][field] =
      field === "isCorrect" ? value === "true" : value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", options: [{ optionText: "", isCorrect: false }] },
    ]);
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ optionText: "", isCorrect: false });
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(oIndex, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...quiz,
      questions: questions.map((q) => ({
        text: q.text,
        options: q.options.map((opt) => ({
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
        })),
      })),
    };

    try {
      await axios.put(`${PRODUCTION_URL}/quiz/${id}`, payload);
      alert("Quiz updated successfully!");
      navigate("/dashboard/quiz");
    } catch (error) {
      console.error("Error updating quiz:", error);
      alert("Failed to update quiz");
    }
  };

  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return ""; // prevent invalid date parsing
    const date = new Date(dateString);
    if (isNaN(date)) return ""; // check for invalid date
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 mt-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Exam</h1>
        <div className="mb-4">
          <input
            type="text"
            name="title"
            placeholder="Exam Title"
            value={quiz.title}
            onChange={handleQuizChange}
            className="w-full p-2 rounded bg-gray-800 text-white mb-2"
          />
          <input
            type="datetime-local"
            name="startTime"
            value={formatDateTimeLocal(quiz.startTime)} 
            onChange={handleQuizChange}
            className="w-full p-2 rounded bg-gray-800 text-white mb-2"
          />
          <input
            type="datetime-local"
            name="endTime"
            value={formatDateTimeLocal(quiz.endTime)}
            className="w-full p-2 rounded bg-gray-800 text-white mb-2"
          />
          <select
            name="courseId"
            value={quiz.courseId}
            onChange={handleQuizChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.courseName} ({course.courseCode})
              </option>
            ))}
          </select>
        </div>

        {questions.map((question, qIndex) => (
          <div key={qIndex} className="mb-6 border border-gray-700 p-4 rounded">
            <input
              type="text"
              placeholder={`Question ${qIndex + 1}`}
              value={question.text}
              onChange={(e) => handleQuestionChange(qIndex, e)}
              className="w-full p-2 rounded bg-gray-800 text-white mb-3"
            />

            {question.answerOptions.map((option, oIndex) => (
              <div key={oIndex} className="flex items-center gap-4 mb-2">
                <input
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  value={option.optionText}
                  onChange={(e) =>
                    handleOptionChange(
                      qIndex,
                      oIndex,
                      "optionText",
                      e.target.value
                    )
                  }
                  className="flex-1 p-2 rounded bg-gray-800 text-white"
                />
                <select
                  value={option.isCorrect.toString()}
                  onChange={(e) =>
                    handleOptionChange(
                      qIndex,
                      oIndex,
                      "isCorrect",
                      e.target.value
                    )
                  }
                  className="bg-gray-700 text-white p-2 rounded"
                >
                  <option value="false">Incorrect</option>
                  <option value="true">Correct</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeOption(qIndex, oIndex)}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              onClick={() => addOption(qIndex)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2"
            >
              Add Option
            </button>
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-4"
        >
          Add Question
        </button>
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded"
        >
          Update Quiz
        </button>
      </div>
    </div>
  );
};

export default EditQuiz;