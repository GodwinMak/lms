import React, { useState } from "react";
import axios from "axios";
import { PRODUCTION_URL } from "../../utils/Api";

const CreateResearch = () => {
  const student = JSON.parse(localStorage.getItem("userData"));
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    educationLevel: "Bachelor",
    researchTitle: "",
    description: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.file?.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      alert("Only .docx files are allowed");
      return;
    }

    const payload = new FormData();
    for (const key in formData) {
      payload.append(key, formData[key]);
    }
    payload.append("studentId", student.id); // Replace with actual user ID

    try {
      const response = await axios.post(`${PRODUCTION_URL}/dissertation`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Proposal submitted successfully!");
      console.log(response.data);
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        educationLevel: "Bachelor",
        researchTitle: "",
        description: "",
        file: null,
      })
    } catch (error) {
      console.log(error)
      console.error(error.response?.data || error.message);
      alert("Failed to submit proposal.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 mt-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Submit Dissertation Proposal</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          />
          <input
            type="text"
            name="middleName"
            placeholder="Middle Name"
            value={formData.middleName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          />
          <select
            name="educationLevel"
            value={formData.educationLevel}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          >
            <option value="Bachelor">Bachelor</option>
            <option value="Masters">Masters</option>
            <option value="PhD">PhD</option>
          </select>
          <input
            type="text"
            name="researchTitle"
            placeholder="Research Title"
            value={formData.researchTitle}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            rows={4}
            required
          />
          <input
            type="file"
            name="file"
            accept=".docx"
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          />

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded"
          >
            Submit Dissertation
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateResearch;
