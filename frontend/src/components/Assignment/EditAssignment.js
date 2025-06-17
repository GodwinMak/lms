import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { PRODUCTION_URL } from "../../utils/Api";

const EditAssignment = () => {
  const { id } = useParams(); // assignment id from URL
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    startTime: "",
    endTime: "",
    assignmentDoc: null,
    assignmentDescription: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Load courses
    axios.get(`${PRODUCTION_URL}/course`)
      .then(res => setCourses(res.data))
      .catch(err => console.error("Error loading courses", err));

    // Load assignment data
    axios.get(`${PRODUCTION_URL}/assignment/${id}`)
      .then(res => {
        const a = res.data;
        setFormData({
          courseId: a.courseId,
          title: a.title,
          startTime: a.startTime.slice(0, 16), // For datetime-local input
          endTime: a.endTime.slice(0, 16),
          assignmentDoc: null,
          assignmentDescription: a.assignmentDescription || "",
        });
      })
      .catch(err => console.error("Error loading assignment", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      assignmentDoc: e.target.files[0],
    }));
  };

  const validate = () => {
    const err = {};
    if (!formData.courseId) err.courseId = "Course is required";
    if (!formData.title) err.title = "Title is required";
    if (!formData.startTime) err.startTime = "Start time is required";
    if (!formData.endTime) err.endTime = "End time is required";
    if (!formData.assignmentDescription) err.assignmentDescription = "Description is required";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = new FormData();
    payload.append("courseId", formData.courseId);
    payload.append("title", formData.title);
    payload.append("startTime", formData.startTime);
    payload.append("endTime", formData.endTime);
    payload.append("assignmentDescription", formData.assignmentDescription);
    if (formData.assignmentDoc) {
      payload.append("assignmentDoc", formData.assignmentDoc);
    }

    try {
      await axios.put(`${PRODUCTION_URL}/assignment/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Assignment updated successfully!");
      navigate("/dashboard/assignment");
    } catch (err) {
      console.error("Error updating assignment", err);
      alert("Failed to update assignment");
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gray-50 p-6 dark:bg-gray-800 mt-14">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 dark:bg-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">Edit Assignment</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Course *</label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md dark:bg-gray-600 dark:text-white ${errors.courseId ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.courseName}</option>
              ))}
            </select>
            {errors.courseId && <p className="text-red-600 text-sm mt-1">{errors.courseId}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Assignment Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md dark:bg-gray-600 dark:text-white ${errors.title ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Start Time *</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md dark:bg-gray-600 dark:text-white ${errors.startTime ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.startTime && <p className="text-red-600 text-sm mt-1">{errors.startTime}</p>}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">End Time *</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md dark:bg-gray-600 dark:text-white ${errors.endTime ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.endTime && <p className="text-red-600 text-sm mt-1">{errors.endTime}</p>}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Assignment Description *</label>
            <textarea
              name="assignmentDescription"
              value={formData.assignmentDescription}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md dark:bg-gray-600 dark:text-white ${errors.assignmentDescription ? "border-red-500" : "border-gray-300"}`}
              rows="4"
            />
            {errors.assignmentDescription && <p className="text-red-600 text-sm mt-1">{errors.assignmentDescription}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Change Assignment File (optional)</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-700 dark:text-gray-300"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Update Assignment
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAssignment;
