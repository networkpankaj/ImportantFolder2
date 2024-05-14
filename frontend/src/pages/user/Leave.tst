import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../Model/LeaveModel';
import LeaveTableRow from '../../components/Tables/LeaveTableRow';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';

const Leave = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [leaveId, setLeaveId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/admin/leave');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setLeaveData(result.data.leave || []);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddLeaveModal = () => {
    setIsEdit(false);
    setShowModal(true);
  };

  const editLeave = (id) => {
    setLeaveId(id);
    setIsEdit(true);
    setShowModal(true);
  };

  const deleteLeave = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/leave/${id}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete leave');
      }
      // yaha pe update kar raha hu leave ko active se inactive
      setLeaveData((prevData) =>
        prevData.map((leave) =>
          leave._id === id ? { ...leave, status: 'inactive' } : leave
        )
      );
      toast('Leave deleted successfully.', 'success');
    } catch (error) {
      console.error('Failed to delete leave:', error);
    }
  };
  const activateLeave = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/leave/${id}/activate`,
        {
          method: 'PATCH',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to activate leave');
      }
      fetchData();
      toast.success('leave activated successfully.');
    } catch (error) {
      console.error('Failed to activate leave:', error);
      toast.error('Failed to activate leave.');
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
      <Breadcrumb pageName='Leave' />
      {error && <p>Error: {error}</p>}
      <div className='rounded-sm border border-stroke bg-white px-5 pt-4 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 flex justify-end'>
        <div>
          <button
            onClick={openAddLeaveModal}
            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>
            {' '}
            Apply{' '}
          </button>
          {showModal && (
            <Modal
              onClose={() => setShowModal(false)}
              isEdit={isEdit}
              leaveId={leaveId}
              updateLeaveData={setLeaveData}
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
                <th className='min-w-[100px] py-4 px-4 font-medium text-black dark:text-white'>
                  Type
                </th>
                <th className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white'>
                  Start
                </th>
                <th className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white'>
                  End
                </th>
                <th className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white'>
                  Reason
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
              {leaveData && leaveData.length > 0 ? (
                leaveData.map((leave, index) => (
                  <LeaveTableRow
                    key={index}
                    leave={leave}
                    index={index}
                    onEdit={() => editLeave(leave._id)}
                    onDelete={deleteLeave}
                    onActivate={activateLeave}
                  />
                ))
              ) : (
                <p className='flex justify-center items-end text-xl w-full'>
                  No leave Data Found
                </p>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Leave;
