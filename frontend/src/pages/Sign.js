import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { PRODUCTION_URL } from "../utils/Api";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Sign = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    Id: "",
    role: "",
    password: "",
    role: ""
  });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const { Id, password, firstName, lastName, middleName, role } = form;
    if (!Id || !password || !firstName || !lastName || !middleName || !role) {
      alert("Please fill all fields");
      setSubmitting(false);
      return;
    }

    try {
      const res = await axios.post(`${PRODUCTION_URL}/user`, {
        Id,
        password,
        firstName,
        lastName,
        middleName,
        role
      });

      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("userData", JSON.stringify(res.data.user));
      dispatch({ type: "SIGN_IN_TOKEN", payload: res.data.token });
      dispatch({ type: "SIGN_IN_DATA", payload: res.data.user });
      navigate("/");
    } catch (error) {
      console.error(error);
      console.log(error)
      alert(error?.response?.data?.message || "Server Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-red-50 px-4">
      <form
        className="w-full max-w-md p-6 shadow-lg bg-white rounded-md"
        onSubmit={submit}
      >
        <h1 className="text-3xl text-center font-semibold">
          <i className="fa-solid fa-user" /> Sign Up
        </h1>
        <hr className="mt-3" />

        <div className="mt-3">
          <label className="block text-base mb-2">First Name</label>
          <input
            type="text"
            className="border w-full text-base px-3 py-2 rounded focus:outline-none focus:border-gray-600"
            placeholder="Enter First Name..."
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
        </div>

        <div className="mt-3">
          <label className="block text-base mb-2">Middle Name</label>
          <input
            type="text"
            className="border w-full text-base px-3 py-2 rounded focus:outline-none focus:border-gray-600"
            placeholder="Enter Middle Name..."
            value={form.middleName}
            onChange={(e) => setForm({ ...form, middleName: e.target.value })}
          />
        </div>

        <div className="mt-3">
          <label className="block text-base mb-2">Last Name</label>
          <input
            type="text"
            className="border w-full text-base px-3 py-2 rounded focus:outline-none focus:border-gray-600"
            placeholder="Enter Last Name..."
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>
        <div className="mt-3">
          <label className="block text-base mb-2">Role</label>
          <select
            type="text"
            className="border w-full text-base px-3 py-2 rounded focus:outline-none focus:border-gray-600"
            placeholder="Enter Role..."
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option>Select Role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        <div className="mt-3">
          <label className="block text-base mb-2">ID</label>
          <input
            type="text"
            className="border w-full text-base px-3 py-2 rounded focus:outline-none focus:border-gray-600"
            placeholder="Enter Student ID..."
            value={form.Id}
            onChange={(e) => setForm({ ...form, Id: e.target.value })}
          />
        </div>

        <div className="mt-3">
          <label className="block text-base mb-2">Password</label>
          <input
            type="password"
            className="border w-full text-base px-3 py-2 rounded focus:outline-none focus:border-gray-600"
            placeholder="Enter Password..."
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div className="mt-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <input type="checkbox" />
            <label>Remember Me</label>
          </div>
        </div>

        <div className="mt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="border-2 border-indigo-700 bg-indigo-700 text-white py-2 w-full rounded-md hover:bg-transparent hover:text-indigo-700 font-semibold"
          >
            <i className="fa-solid fa-right-to-bracket" />
            &nbsp;&nbsp;{isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </div>

        <div className="mt-2 text-center text-blue-600 hover:underline">
          <Link to="/">I have an account</Link>
        </div>
      </form>
    </div>
  );
};

export default Sign;
