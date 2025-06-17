import React, { useState, useEffect } from 'react';
import Table from "./Table";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { PRODUCTION_URL } from '../../utils/Api';

dayjs.extend(duration);

const Assignment = () => {
  const navigate = useNavigate();
  const [datum, setDatum] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${PRODUCTION_URL}/assignment`);
      setDatum(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this assignment?");
    if (!confirm) return;

    try {
      await axios.delete(`${PRODUCTION_URL}/assignment/${id}`);
      setDatum(prev => prev.filter(item => item.id !== id));
      alert("Assignment deleted successfully.");
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete assignment.");
    }
  };

  const columns = React.useMemo(() => [
    {
      Header: "Course",
      accessor: row => row.course?.courseName || "N/A",
    },
    {
      Header: "Start Time",
      accessor: "startTime",
      Cell: ({ value }) => dayjs(value).format("DD MMM YYYY, HH:mm"),
    },
    {
      Header: "End Time",
      accessor: "endTime",
      Cell: ({ value }) => dayjs(value).format("DD MMM YYYY, HH:mm"),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => (
        <span
          className={`px-2 py-1 rounded text-white ${
            value === "active" ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      Header: "Remaining Time",
      id: "remainingTime",
      accessor: "endTime",
      Cell: ({ value }) => {
        const now = dayjs();
        const end = dayjs(value);
        const diff = end.diff(now);

        if (diff <= 0) return <span className="text-red-500">Expired</span>;

        const rem = dayjs.duration(diff);
        return (
          <span>
            {rem.days()}d {rem.hours()}h {rem.minutes()}m
          </span>
        );
      },
    },
    {
      Header: "Action",
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
            onClick={() => navigate(`/dashboard/editAssignment/${row.original.id}`)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            onClick={() => handleDelete(row.original.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ], []);

  const data = React.useMemo(() => datum, [datum]);

  return (
    <div className="text-gray-500 bg-gray-100 p-4 sm:ml-64 lg:flex-row translate-all duration-300 mt-14 dark:bg-gray-800 min-h-screen">
      <main className="px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Assignment Management</h1>
        </div>
        <div className="mt-6">
          <Table columns={columns} data={data} />
        </div>
      </main>
    </div>
  );
};

export default Assignment;
