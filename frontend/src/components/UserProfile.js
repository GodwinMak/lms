import React, { useState, useContext } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import {PRODUCTION_URL} from "../utils/Api"
import axios from "axios";

const UserProfile = () => {
  const { state } = useAuthContext();
  const user = state.userData;

  console.log(user)

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordChange =async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setMessage("");
      return;
    }

    try {
      const payload = {oldPassword, newPassword}

      await axios.put(`${PRODUCTION_URL}/user/password/${user?.id}`, payload)
      .then(res =>{
        setMessage("Password updated successfully!");
        setError("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
    } catch (error) {
      alert("An error occurred while updating the password. Please try again.");
      console.error("Error updating password:", error);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gray-50 p-6 dark:bg-gray-800 mt-14">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 dark:bg-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">User Profile</h2>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
            <input
              value={user?.firstName || ""}
              disabled
              className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-600 dark:text-white border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Middle Name</label>
            <input
              value={user?.middleName || ""}
              disabled
              className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-600 dark:text-white border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
            <input
              value={user?.lastName || ""}
              disabled
              className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-600 dark:text-white border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">User ID</label>
            <input
              value={user?.userId || ""}
              disabled
              className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-600 dark:text-white border-gray-300"
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-white">Change Password</h3>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-600 dark:text-white border-gray-300"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-600 dark:text-white border-gray-300"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-600 dark:text-white border-gray-300"
            />
          </div>

          {message && <p className="text-green-600 text-sm">{message}</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
