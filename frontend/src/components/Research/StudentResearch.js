import React, { useEffect, useState } from "react";
import axios from "axios";
import { PRODUCTION_URL } from "../../utils/Api";

const StudentResearch = () => {
  const student = JSON.parse(localStorage.getItem("userData"));
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await axios.get(
          `${PRODUCTION_URL}/research/student/${student.id}`
        );
        setProposals(res.data);
      } catch (err) {
        console.error("Error fetching proposals", err);
      }
    };
    fetchProposals();
  }, [student.id]);

  if (selectedProposal) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 mt-10">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setSelectedProposal(null)}
            className="mb-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            ← Back to Proposals
          </button>
          <div className="bg-gray-800 p-6 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-2">
              {selectedProposal.researchTitle}
            </h2>
            <p>
              <strong>Student:</strong> {selectedProposal.firstName}{" "}
              {selectedProposal.middleName} {selectedProposal.lastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedProposal.email}
            </p>
            <p>
              <strong>Level:</strong> {selectedProposal.educationLevel}
            </p>
            <p className="mb-4">
              <strong>Description:</strong> {selectedProposal.description}
            </p>
            <p className="mb-4">
              <strong>Status:</strong> {selectedProposal.status}
            </p>

            <div className="mt-4">
              <a
                href={`${PRODUCTION_URL}/uploads/${selectedProposal.filePath}`}
                download
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Download Proposal
              </a>
            </div>

            {selectedProposal.status === "Reject for Amending" &&
              selectedProposal.teacherFeedbackFile && (
                <div className="mt-6">
                  <p className="text-yellow-400 font-semibold mb-2">
                    Feedback File from Teacher:
                  </p>
                  <a
                    href={`${PRODUCTION_URL}/uploads/${selectedProposal.teacherFeedbackFile}`}
                    download
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Download Feedback
                  </a>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 mt-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Research Proposals</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700 text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2 border border-gray-700">#</th>
                <th className="px-4 py-2 border border-gray-700">Title</th>
                <th className="px-4 py-2 border border-gray-700">Level</th>
                <th className="px-4 py-2 border border-gray-700">Email</th>
                <th className="px-4 py-2 border border-gray-700">Submitted</th>
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
                    {proposal.educationLevel}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {proposal.email}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {new Date(proposal.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {proposal.status}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    <button
                      onClick={() => setSelectedProposal(proposal)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {proposals.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-400">
                    No proposals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentResearch;
