import React, { useState, useEffect } from "react";
import Table, {
  // AvatarCell,
  SelectColumnFilter,
  StatusPill,
} from "./Table";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PRODUCTION_URL } from "../../utils/Api";

const Student = () => {
  const navigate = useNavigate();
  const [datum, setDatum] = useState([]);
  const fetchData = async () => {
    try {
      const res = await axios.get(`${PRODUCTION_URL}/user`);
      const students = res.data.filter((user) => user.role === "student");
      setDatum(students);
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
      console.error("Error updating status", error);
    }
  }
  const columns = React.useMemo(() => [
    {
      Header: "First Name",
      accessor: "firstName",
      // Cell: AvatarCell,
      emailAccessor: "email",
    },
    {
      Header: "Middle Name",
      accessor: "middleName",
      // Cell: AvatarCell,
      emailAccessor: "email",
    },
    {
      Header: "Last Name",
      accessor: "lastName",
      // Cell: AvatarCell,
      emailAccessor: "email",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Action",
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
            onClick={() =>
              navigate(`/dashboard/editStudent/${row.original.id}`)
            }
          >
            Edit
          </button>
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
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            // onClick={() => handleDelete(row.original)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ]);

  const data = React.useMemo(() => {
    return datum;
  });


  return (
    <div className="text-gray-500 bg-gray-100 p-4 sm:ml-64 lg:flex-row translate-all duration-300 mt-14 dark:bg-gray-800 min-h-screen">
      <main className="px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">System Course Management</h1>
          {/* <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          // onClick={handleCreateCourse}
        >
          Create Course
        </button> */}
        </div>
        <div className="mt-6">
          <Table columns={columns} data={data} />
        </div>
      </main>
      {/* {editModalOpen && (
      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={editUser}
        onUserUpdated={() => {
          // Refresh user list
          axios
            .get(`${PRODUCTION_URL}/user`)
            .then((res) => setUsers(res.data.users));
        }}
      />
    )} */}
    </div>
  );
};

export default Student;
