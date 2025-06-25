import React, { useState, useEffect } from "react";
import axios from "axios";
import { PRODUCTION_URL } from "../../utils/Api";

const CreateQuiz = () => {
  const [courses, setCourses] = useState([]);
  const [quiz, setQuiz] = useState({
    title: "",
    startTime: "",
    endTime: "",
    courseId: "",
  });
  const [questions, setQuestions] = useState([
    { text: "", options: [{ optionText: "", isCorrect: false }] },
  ]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${PRODUCTION_URL}/course/`);
        console.log(response.data);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

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
      const response = await axios.post(`${PRODUCTION_URL}/quiz`, payload);
      console.log("Quiz created:", response.data);
      alert("Quiz created successfully!");
      // Reset form
      setQuiz({ title: "", startTime: "", endTime: "", courseId: "" });
      setQuestions([
        { text: "", options: [{ optionText: "", isCorrect: false }] },
      ]);
    } catch (error) {
      console.log(error);
      console.error(
        "Error submitting quiz:",
        error.response?.data || error.message
      );
      alert("Failed to create quiz");
    }
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(oIndex, 1);
    setQuestions(newQuestions);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 mt-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Exam</h1>
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
            value={quiz.startTime}
            onChange={handleQuizChange}
            className="w-full p-2 rounded bg-gray-800 text-white mb-2"
          />
          <input
            type="datetime-local"
            name="endTime"
            value={quiz.endTime}
            onChange={handleQuizChange}
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

            {question.options.map((option, oIndex) => (
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
          Save Quiz
        </button>
      </div>
    </div>
  );
};

export default CreateQuiz;
