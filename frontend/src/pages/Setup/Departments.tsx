import React, { useState, useEffect, useCallback } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Modal from '../Model/DepartmentModel';
import DepartmentTableRow from '../../components/Tables/DepartmentTableRow';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Departments = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [departmentId, setDepartmentId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(
  //         'http://localhost:3000/api/v1/admin/department'
  //       );
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch data');
  //       }
  //       const result = await response.json();
  //       setDepartmentData(result.data.department || []);
  //     } catch (error) {
  //       setError(error.message);
  //     }
  //   };

  //   fetchData();
  // }, []);
  const fetchData = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/v1/admin/department'
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setDepartmentData(result.data.department || []);
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

  const editDepartment = (id) => {
    setDepartmentId(id);
    setIsEdit(true);
    setShowModal(true);
  };

  const deleteDepartment = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/department/${id}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete department');
      }
      // yaha pe update kar raha hu department ko active se inactive
      setDepartmentData((prevData) =>
        prevData.map((department) =>
          department._id === id
            ? { ...department, status: 'inactive' }
            : department
        )
      );
      toast('Department deleted successfully.', 'success');
    } catch (error) {
      console.error('Failed to delete department:', error);
    }
  };
  const activateDepartment = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/department/${id}/activate`,
        {
          method: 'PATCH',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to activate department');
      }
      fetchData();
      toast.success('Department activated successfully.');
    } catch (error) {
      console.error('Failed to activate department:', error);
      toast.error('Failed to activate department.');
    }
  };

  //alert messages
  const handleAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName='Department' />
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
              departmentId={departmentId}
              updateDepartmentData={setDepartmentData}
              fetchData={fetchData}
            />
          )}
        </div>
        {alertVisible && (
          <div className={`alert-${alertType}`}>
            {alertType === 'success' && <AlertSuccess message={alertMessage} />}
            {alertType === 'warning' && <AlertWarning message={alertMessage} />}
            {alertType === 'error' && <AlertError message={alertMessage} />}
          </div>
        )}
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
                  Department Name
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
              {departmentData && departmentData.length > 0 ? (
                departmentData.map((department, index) => (
                  <DepartmentTableRow
                    key={index}
                    department={department}
                    index={index}
                    onEdit={() => editDepartment(department._id)}
                    onDelete={deleteDepartment}
                    onActivate={activateDepartment}
                  />
                ))
              ) : (
                <p className='flex justify-center items-end text-xl w-full'>
                  No Department Data Found
                </p>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Departments;