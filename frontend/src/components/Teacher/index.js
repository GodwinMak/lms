import React, { useState, useEffect } from 'react';
import Table from './Table';
import axios from 'axios';
import { PRODUCTION_URL } from '../../utils/Api';

const Teacher = () => {
  const [datum, setDatum] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${PRODUCTION_URL}/user`);
      const teachers = res.data.filter(user => user.role === "teacher");
      setDatum(teachers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAllow = async (id) => {
    try {
      await axios.put(`${PRODUCTION_URL}/user/${id}/status`, {
        status: "Allowed",
      });
      fetchData(); // refresh after update
    } catch (error) {
        alert(error.response.data.message)
      console.error("Error updating status", error);
    }
  };

  const handleDisallow = async (id) => {
    try {
      await axios.put(`${PRODUCTION_URL}/user/${id}/status`, {
        status: "Not Allowed",
      });
      fetchData(); // refresh after update
    } catch (error) {
        alert(error.response.data.message)
      console.error(error.response.data.message);
    }
  }

  const columns = React.useMemo(() => [
    {
      Header: "First Name",
      accessor: "firstName",
    },
    {
      Header: "Middle Name",
      accessor: "middleName",
    },
    {
      Header: "Last Name",
      accessor: "lastName",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Action",
      Cell: ({ row }) => (
        <div className='flex gap-2' >
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          onClick={() => handleAllow(row.original.id)}
        >
          Allow
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          onClick={() => handleDisallow(row.original.id)}
        >
          Disallowed
        </button>
        </div>
        
      ),
    },
  ], []);

  return (
    <div className="text-gray-500 bg-gray-100 p-4 sm:ml-64 mt-14 dark:bg-gray-800 min-h-screen">
      <main className="px-4 sm:px-6 lg:px-8 pt-4">
        <h1 className="text-xl font-semibold mb-4">Teachers</h1>
        <Table columns={columns} data={datum} />
      </main>
    </div>
  );
};

export default Teacher;
