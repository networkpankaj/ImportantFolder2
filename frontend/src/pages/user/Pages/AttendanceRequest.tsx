import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../Model/UserAttendanceModel';
import LeaveTableRow from '../Table/UserAttendanceRequestTable';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import UserLayout from '../../../layout/UserLayout';

const AttendanceRequest = () => {
  const [requestData, setRequestData] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [requestId, setRequestId] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/attendance-request');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setRequestData(result.data.Request || []);
      console.log(result.data.Request)
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddRequestModal = () => {
    setIsEdit(false);
    setShowModal(true);
  };

  const editRequest = (id) => {
    console.log("heloo")
    console.log(id)
    setRequestId(id);
    setIsEdit(true);
    setShowModal(true);
  };

  const deleteRequest = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/attendance-request/${id}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete leave');
      }
      // yaha pe update kar raha hu leave ko active se inactive
      setRequestData((prevData) =>
        prevData.map((request) =>
          request._id === id ? { ...request, status: 'inactive' } : request
        )
      );
      toast('request deleted successfully.', 'success');
    } catch (error) {
      console.error('Failed to delete request:', error);
    }
  };
  const activateRequest = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/attendance-request/${id}/activate`,
        {
          method: 'PATCH',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to activate request');
      }
      fetchData();
      toast.success('request activated successfully.');
    } catch (error) {
      console.error('Failed to activate request:', error);
      toast.error('Failed to activate request.');
    }
  };

  return (
    <UserLayout>
      <Breadcrumb pageName='Request' />
      {error && <p>Error: {error}</p>}
      <div className='rounded-sm border border-stroke bg-white px-5 pt-4 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 flex justify-end'>
        <div>
          <button
            onClick={openAddRequestModal}
            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>
            {' '}
            Apply{' '}
          </button>
          {showModal && (
            <Modal
              onClose={() => setShowModal(false)}
              isEdit={isEdit}
              requestId={requestId}
              updateRequestData={setRequestData}
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
                
                 <th className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white'>
                  Date
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
              {requestData && requestData.length > 0 ? (
                requestData.map((request, index) => (
                  <LeaveTableRow
                    key={index}
                    request={request}
                    index={index}
                    onEdit={() => editRequest(request._id)}
                    onDelete={deleteRequest}
                    onActivate={activateRequest}
                  />
                ))
              ) : (
                <p className='flex justify-center items-end text-xl w-full'>
                  No request Data Found
                </p>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </UserLayout>
  );
};

export default AttendanceRequest;
