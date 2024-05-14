import React, { useState, useEffect, useRef } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Modal from '../Model/UserModel';
import UserTableRow from '../../components/Tables/UserTableRow';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const User = () => {
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userId, setUserId] = useState(null);

  const fetchData = async () => {
    try {
      const requestOptions = {
        method: 'GET',
        credentials: 'include', // Include cookies in cross-origin requests
      };
      const response = await fetch(
        'http://localhost:3000/api/v1/user',
        requestOptions
      );
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const jsonData = await response.json();
      const users = jsonData.data.user || [];

      // Fetch department and designation details for each user concurrently
      const updatedUsers = await Promise.all(
        users.map(async (user) => {
          try {
            const [departmentResponse, designationResponse] = await Promise.all(
              [
                fetch(
                  `http://localhost:3000/api/v1/admin/department/${user.userDepartment}`
                ),
                fetch(
                  `http://localhost:3000/api/v1/admin/designation/${user.userDesignation}`
                ),
              ]
            );

            if (!departmentResponse.ok) {
              throw new Error('Failed to fetch department data.');
            }
            if (!designationResponse.ok) {
              throw new Error('Failed to fetch designation data.');
            }

            const departmentData = await departmentResponse.json();
            const designationData = await designationResponse.json();
            // console.log(designationData);

            return {
              ...user,
              departmentName:
                departmentData.data.department.departmentName || 'Unknown',
              designationName:
                designationData.data.designation.designationName || 'Unknown',
            };
          } catch (error) {
            console.error(`Error fetching data for user ${user._id}:`, error);
            // Return the user with placeholder names
            return {
              ...user,
              departmentName: 'Unknown',
              designationName: 'Unknown',
            };
          }
        })
      );

      setUserData(updatedUsers);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //delete user
  const deleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/user/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete role');
      }
      setUserData((prevData) =>
        prevData.map((user) =>
          user._id === id ? { ...user, status: 'inactive' } : user
        )
      );
      toast('User deleted successfully.', 'success');
      // Handle success (e.g., update departmentData state)
    } catch (error) {
      console.error('Failed to delete department:', error);
      toast.error('Failed to delete department:', error);
    }
  };

  const activateUser = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/user/${id}/activate`,
        {
          method: 'PATCH',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to activate user');
      }
      fetchData();
      toast.success('User activated successfully.');
      // Handle success (e.g., update departmentData state)
    } catch (error) {
      console.error('Failed to activate department:', error);
      toast.error('Failed to activate department:', error);
    }
  };

  // close the popup  when user clicks outside of it
  const modalRef = useRef(null);

  const openAddUserModal = () => {
    setIsEdit(false);
    setShowModal(true);
  };

  const editUser = (id) => {
    setUserId(id);
    setIsEdit(true);
    setShowModal(true);
    // Implement edit functionality
  };
  return (
    <DefaultLayout>
      <Breadcrumb pageName='Tables' />
      {error && <p>Error: {error}</p>}
      <div className='rounded-sm border border-stroke bg-white px-5 pt-4 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 flex justify-end'>
        <div>
          <button
            onClick={openAddUserModal}
            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>
            {' '}
            Add New{' '}
          </button>
          {showModal && (
            <Modal
              onClose={() => setShowModal(false)}
              isEdit={isEdit}
              userId={userId}
              updateUserData={setUserData}
              fetchData={fetchData}
            />
          )}
        </div>
      </div>
      <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
        <div className='max-w-full overflow-x-auto'>
          <table className='w-full table-auto'>
            <thead>
              <tr className='bg-gray-2 text-left dark:bg-meta-4'>
                <th className='min-w-[50px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11'>
                  S.No
                </th>
                <th className='min-w-[50px] py-4 px-4 font-medium text-black dark:text-white '>
                  User Code
                </th>
                <th className='min-w-[150px] py-4 px-4 font-medium text-black dark:text-white'>
                  Name
                </th>
                <th className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white'>
                  Email
                </th>
                <th className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white'>
                  Phone
                </th>
                {/* <th className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white'>
                  Department
                </th>
                <th className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white'>
                  Designation
                </th> */}
                <th className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white'>
                  Status
                </th>
                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {userData && userData.length > 0 ? (
                userData.map((user, index) => (
                  <UserTableRow
                    key={index}
                    user={user}
                    index={index}
                    onEdit={() => editUser(user._id)}
                    onDelete={deleteUser}
                    onActivate={activateUser}
                  />
                ))
              ) : (
                <p className='flex justify-center items-end text-xl w-full'>
                  No User Data Found
                </p>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default User;
