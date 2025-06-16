import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { PRODUCTION_URL } from "../../utils/Api";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    password: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${PRODUCTION_URL}/user/${id}`)
      .then(res => {
        setFormData({
          firstName: res.data.firstName,
          middleName: res.data.middleName,
          lastName: res.data.lastName,
          password: "", // optional: leave blank until changed
        });
      })
      .catch(err => {
        setError("User not found");
        console.error(err);
      });
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`${PRODUCTION_URL}/user/${id}`, formData);
      alert("Student updated successfully!");
      navigate("/dashboard/students");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gray-50 p-6 dark:bg-gray-800 mt-14">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 dark:bg-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">Edit Student</h2>

        {error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-600 dark:text-white border-gray-300"
              />
            </div>

            {/* Middle Name */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-600 dark:text-white border-gray-300"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-600 dark:text-white border-gray-300"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Password (optional)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-600 dark:text-white border-gray-300"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditStudent;
