import React, {useState} from 'react'
import axios from 'axios';
import { PRODUCTION_URL } from '../../utils/Api';

const CreateCourse = () => {
  const [taskData, setTaskData] = useState({
    courseName: "",
    courseCode: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const errors = {};
    if (!taskData.courseCode) {errors.couserName = "Course is required"};
    if (!taskData.courseCode) {errors.customer_name = "Course Code Name is required"};
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Assuming an API endpoint to create a task
      await axios.post(`${PRODUCTION_URL}/course`, taskData);
      alert("Course created successfully!");
      // Reset form after successful submission
      setTaskData({
        courseName: "",
        courseCode: "",
      });
    } catch (error) {
      console.error("Error creating task", error);
      alert("There was an error creating the Course.");
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gray-50 p-6 dark:bg-gray-800 mt-14">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 dark:bg-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">Create New Course</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contractor */}
            <div className="form-group">
              <label htmlFor="contractors" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Course Name *
              </label>
              <input
                id="courseName"
                name="courseName"
                // value={taskData.contractor_id}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-2 border ${errors.courseName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white`}
             />
              {errors.courseName && <p className="mt-1 text-sm text-red-600">{errors.courseName}</p>}
            </div>

            {/* Customer Name */}
            <div className="form-group">
              <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Customer Code *
              </label>
              <input
                type="text"
                id="courseCode"
                name="courseCode"
                value={taskData.courseCode}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-2 border ${errors.courseCode ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white`}
                placeholder="Enter Customer Name"
              />
              {errors.courseCode && <p className="mt-1 text-sm text-red-600">{errors.courseCode}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCourse