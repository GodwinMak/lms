import React, { useEffect, useState } from "react";
import axios from "axios";
import { PRODUCTION_URL } from "../../utils/Api";

const TeacherUpdateResearch = () => {
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [status, setStatus] = useState("");
  const [feedbackFile, setFeedbackFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAllProposals = async () => {
      try {
        const res = await axios.get(`${PRODUCTION_URL}/research/`);
        setProposals(res.data);
      } catch (error) {
        console.error("Failed to fetch proposals", error);
      }
    };
    fetchAllProposals();
  }, []);

  const handleStatusUpdate = async () => {
    if (!selectedProposal) return;

    const formData = new FormData();
    formData.append("status", status);
    if (status === "Reject for Amending" && feedbackFile) {
      formData.append("feedbackFile", feedbackFile); // key must be "feedbackFile"
    }

    try {
      await axios.put(
        `${PRODUCTION_URL}/research/update-status/${selectedProposal.id}`,
        formData
      );
      setMessage("Status updated successfully.");
      setSelectedProposal(null);
      setStatus("");
      setFeedbackFile(null);

      const res = await axios.get(`${PRODUCTION_URL}/research`);
      setProposals(res.data);
    } catch (error) {
      console.error("Failed to update status", error);
      setMessage("Failed to update status.");
    }
  };

  if (selectedProposal) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 mt-10">
        <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">
            Update Status: {selectedProposal.researchTitle}
          </h2>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Select Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-gray-700 text-white border border-gray-600 px-3 py-2 rounded"
            >
              <option value="">-- Select --</option>
              <option value="Panel Reviewal">Panel Reviewal</option>
              <option value="Reject for Amending">Reject for Amending</option>
              <option value="Approved">Approved</option>
            </select>
          </div>

          {status === "Reject for Amending" && (
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Upload Feedback (.docx)
              </label>
              <input
                type="file"
                accept=".docx"
                onChange={(e) => setFeedbackFile(e.target.files[0])}
                className="w-full text-white bg-gray-700 border border-gray-600 rounded px-3 py-2"
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleStatusUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update Status
            </button>
            <button
              onClick={() => setSelectedProposal(null)}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>

          {message && <p className="mt-4 text-green-400">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">All Research Proposals</h1>
        <table className="min-w-full border border-gray-700 text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 border border-gray-700">#</th>
              <th className="px-4 py-2 border border-gray-700">Title</th>
              <th className="px-4 py-2 border border-gray-700">Student</th>
              <th className="px-4 py-2 border border-gray-700">Email</th>
              <th className="px-4 py-2 border border-gray-700">Status</th>
              <th className="px-4 py-2 border border-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((proposal, index) => (
              <tr key={proposal.id} className="hover:bg-gray-800">
                <td className="px-4 py-2 border border-gray-700">
                  {index + 1}
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  {proposal.researchTitle}
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  {proposal.firstName} {proposal.middleName} {proposal.lastName}
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  {proposal.email}
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  {proposal.status}
                </td>
                <td className="px-4 py-2 border border-gray-700">
                  <button
                    onClick={() => setSelectedProposal(proposal)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                  >
                    Update Status
                  </button>
                </td>
              </tr>
            ))}
            {proposals.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  No research proposals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherUpdateResearch;
