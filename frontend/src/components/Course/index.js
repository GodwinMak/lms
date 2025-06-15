import React, {useState, useEffect} from 'react'
import Table, {
  // AvatarCell,
  SelectColumnFilter,
  StatusPill,
} from "./Table";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { PRODUCTION_URL } from '../../utils/Api';

const Course = () => {

  const [datum, setDatum] = useState([])

  useEffect(() =>{

    const fetchData = async () =>{
      try {
        await axios.get(`${PRODUCTION_URL}/course`)
      .then(res=>{
        setDatum(res.data)
      })
      } catch (error) {
        console.log(error)
      }
    }

    fetchData();
  }, [])


  const handleCreateAssignment = () =>{
    navigate("/dashboard/createAssignment")
  }
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        // Cell: AvatarCell,
        emailAccessor: "email",
      },
      {
        Header: "Course Code",
        accessor: "courseCode",
      },

      {
        Header: "Action",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              onClick={handleCreateAssignment}
            >
              Create Assignment
            </button>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              // onClick={() => handleEdit(row.original)}
            >
              Edit
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
    ],
    []
  );

  const data = React.useMemo(() =>{
    return datum
    .map(a =>({
      name: a.courseName,
      courseCode: a.courseCode
    }))
  });

  const navigate = useNavigate();
  
  const handleCreateCourse = () => {
    navigate("/dashboard/createCourse");
  };

  
  return (
    <div className="text-gray-500 bg-gray-100 p-4 sm:ml-64 lg:flex-row translate-all duration-300 mt-14 dark:bg-gray-800 min-h-screen">
      <main className="px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">System Course Management</h1>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            onClick={handleCreateCourse}
          >
            Create Course
          </button>
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
  )
}

export default Course