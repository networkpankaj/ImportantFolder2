import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Modal from '../Model/RoleModel';
import RoleTableRow from '../../components/Tables/RoleTableRow';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Role = () => {
  const [roleData, setRoleData] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [roleId, setRoleId] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/admin/role');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setRoleData(result.data.role || []);
    } catch (error) {
      setError(error.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const openAddUserModal = () => {
    setIsEdit(false);
    setShowModal(true);
  };

  const editRole = (id) => {
    setRoleId(id);
    setIsEdit(true);
    setShowModal(true);
    // Implement edit functionality
  };

  const deleteRole = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/role/${id}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete role');
      }
      setRoleData((prevData) =>
        prevData.map((role) =>
          role._id === id ? { ...role, status: 'inactive' } : role
        )
      );
      toast('Role deleted successfully.', 'success');
      // Handle success (e.g., update Role state)
    } catch (error) {
      console.error('Failed to delete Role:', error);
    }
  };

  const activateRole = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/role/${id}/activate`,
        {
          method: 'PATCH',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to activate role');
      }
      fetchData();
      toast.success('Role activated successfully.');
      // Handle success (e.g., update Role state)
    } catch (error) {
      console.error('Failed to activate Role:', error);
      toast.error('Failed to activate role.');
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName='Role' />
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
              roleId={roleId}
              updateRoleData={setRoleData}
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
                <th className='min-w-[150px] py-4 px-4 font-medium text-black dark:text-white'>
                  Designation Name
                </th>
                <th className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white'>
                  Status
                </th>
                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {roleData && roleData.length > 0 ? (
                roleData.map((role, index) => (
                  <RoleTableRow
                    key={index}
                    role={role}
                    index={index}
                    onEdit={() => editRole(role._id)}
                    onDelete={deleteRole}
                    onActivate={activateRole}
                  />
                ))
              ) : (
                <p className='flex justify-center items-end text-xl w-full'>
                  No Role Data Found
                </p>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Role;
