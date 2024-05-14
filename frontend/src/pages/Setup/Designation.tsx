import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Modal from '../Model/DesignationModel';
import DesignationTableRow from '../../components/Tables/DesignationTableRow';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Designation = () => {
  const [designationData, setDesignationData] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [designationId, setDesignationId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(
  //         'http://localhost:3000/api/v1/admin/designation'
  //       );
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch data');
  //       }
  //       const result = await response.json();
  //       setDesignationData(result.data.designation || []);
  //     } catch (error) {
  //       setError(error.message);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/v1/admin/designation'
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setDesignationData(result.data.designation || []);
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

  const editDesignation = (id) => {
    setDesignationId(id);
    setIsEdit(true);
    setShowModal(true);
    // Implement edit functionality
  };

  const deleteDesignation = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/Designation/${id}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete designation');
      }
      setDesignationData((prevData) =>
        prevData.map((designation) =>
          designation._id === id
            ? { ...designation, status: 'inactive' }
            : designation
        )
      );
      toast('Designation deleted successfully.', 'success');
      // Handle success (e.g., update designationData state)
    } catch (error) {
      console.error('Failed to delete Designation:', error);
    }
  };

  const activateDesignation = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/Designation/${id}/activate`,
        {
          method: 'PATCH',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to activate designation');
      }
      fetchData();
      toast.success('Designation activated successfully.');
      // Handle success (e.g., update DesignationData state)
    } catch (error) {
      console.error('Failed to activate Designation:', error);
      toast.error('Failed to activate designation.');
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
      <Breadcrumb pageName='Designation' />
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
              designationId={designationId}
              updateDesignationData={setDesignationData}
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
              {designationData && designationData.length > 0 ? (
                designationData.map((designation, index) => (
                  <DesignationTableRow
                    key={index}
                    designation={designation}
                    index={index}
                    onEdit={() => editDesignation(designation._id)}
                    onDelete={deleteDesignation}
                    onActivate={activateDesignation}
                  />
                ))
              ) : (
                <p className='flex justify-center items-end text-xl w-full'>
                  No Designation Data Found
                </p>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Designation;
