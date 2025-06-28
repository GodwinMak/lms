import React from "react";
import LinkItem from "./LinkItem";
import { href, Link } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { FaChartBar, FaUsersCog, FaListAlt } from "react-icons/fa";
import { BiTask } from "react-icons/bi";
import { IoIosSettings } from "react-icons/io";
import {useAuthContext} from "../hooks/useAuthContext"
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isSidebarOpen }) => {

  const navigate = useNavigate();
  const {dispatch} = useAuthContext();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    dispatch({ type: "SIGN_OUT" });
    navigate("/"); // or your login route
  };
  const user = JSON.parse(localStorage.getItem("userData"));
  const role = user?.role; // e.g., 'student' or 'teacher'

  const links = [
    {
      href: "/dashboard",
      icon: FaChartBar,
      text: "Dashboard",
      view: "All",
    },
    {
      href: "/dashboard/course",
      icon: BiTask,
      text: "Course",
      badge: {
        color: "bg-gray-100 text-gray-800",
        darkColor: "dark:bg-gray-700 dark:text-gray-300",
      },
      view: "teacher",
    },
    {
      href: "/dashboard/assignment",
      icon: FaListAlt,
      text: "Assignments",
      view: "teacher",
    },
    {
      href: "/dashboard/answers",
      icon: FaListAlt,
      text: "Answers",
      view: "teacher",
    },
    {
      href: "/dashboard/availablequiz",
      icon: FaListAlt,
      text: "Available Quiz",
      view: "student",
    },
    {
      href: "#",
      icon: FaListAlt,
      text: "Research Proposal",
      view: "student",
      dropdown: ["Create Research","Research Proposal"]
    },
    {
      href: "#",
      icon: FaListAlt,
      text: "Dissertation",
      view: "student",
      dropdown: ["Create Dissertation","Dissertation"]
    },
    {
      href: "#",
      icon: FaListAlt,
      text: "Grant Writing",
      view: "student",
      dropdown: ["Create GrantWriting","Grant Writing"]
    },
    {
      href: "/dashboard/settings",
      icon: IoIosSettings,
      text: "Settings",
      badge: {
        color: "bg-gray-100 text-gray-800",
        darkColor: "dark:bg-gray-700 dark:text-gray-300",
      },
      view: "All",
    },
    {
      href: "/dashboard/students",
      icon: FaUsersCog,
      text: "Students",
      view: "teacher",
    },
    {
      href: "/dashboard/teacher",
      icon: FaUsersCog,
      text: "Teacher",
      view: "teacher",
    },
    {
      href: "#",
      icon: FaListAlt,
      text: "Create Quiz",
      view: "teacher",
      dropdown: ["Quiz","Create Quiz"]
    },
    {
      href: "/dashboard/researchteacher",
      icon: FaListAlt,
      text: "Research Proposal",
      view: "teacher",
    },
        {
      href: "/dashboard/dissertationteacher",
      icon: FaListAlt,
      text: "Dissertation",
      view: "teacher",
    },
    {
      href: "/dashboard/grantteacher",
      icon: FaListAlt,
      text: "Grant Writing",
      view: "teacher",
    },
  ];

  const filteredLinks = links.filter(
    (link) => link.view === "All" || link.view === role
  );

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 transition-transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {filteredLinks.map((link, index) => (
            <LinkItem key={index} {...link} />
          ))}
          <li onClick={handleLogout}>
            <Link className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              <IoIosLogOut className="mr-2" />
              <span className="flex-1 me-3">Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
