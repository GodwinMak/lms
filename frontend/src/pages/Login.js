import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { PRODUCTION_URL } from "../utils/Api";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    Id: "",
    password: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const { Id, password } = form;
    if (!Id || !password) {
      alert("Please fill all fields");
      setSubmitting(false);
      return;
    }

    try {
      const res = await axios.post(`${PRODUCTION_URL}/user/login`, {
        Id,
        password,
      });


      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("userData", JSON.stringify(res.data.user));
      dispatch({ type: "SIGN_IN_TOKEN", payload: res.data.token });
      dispatch({ type: "SIGN_IN_DATA", payload: res.data.user });
      navigate("/dashboard");
    } catch (error) {
      console.error(error.response.data.message);
      alert(error.response.data.message);
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
          <i className="fa-solid fa-user" /> Login
        </h1>
        <hr className="mt-3" />
        <div className="mt-3">
          <label htmlFor="studentId" className="block text-base mb-2">
            ID
          </label>
          <input
            type="text"
            id="studentId"
            className="border w-full text-base px-3 py-2 rounded focus:outline-none focus:border-gray-600"
            placeholder="Enter Student ID..."
            value={form.Id}
            onChange={(e) => setForm({ ...form, Id: e.target.value })}
          />
        </div>
        <div className="mt-3">
          <label htmlFor="password" className="block text-base mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
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
            &nbsp;&nbsp;{isSubmitting ? "Logging in..." : "Login"}
          </button>
        </div>
        <div className="mt-2 text-center text-blue-600 hover:underline">
          <Link to="/signup">I do not have an account</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
