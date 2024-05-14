import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../Model/LeaveModel';
import LeaveTableRow from '../../components/Tables/LeaveTableRowAdmin';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';

const LeaveReport = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [leaveId, setLeaveId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  const fetchData = async () => {
    try {
      const requestOptions = {
        method: 'GET',
        credentials: 'include', // Include cookies in cross-origin requests
      };
      const response = await fetch('http://localhost:3000/api/v1/admin/leave', requestOptions);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      // setLeaveData(result.data.leave || []);

      const leavesWithUsername = await Promise.all(result.data.leave.map(async (leave) => {
        const userResponse = await fetch(`http://localhost:3000/api/v1/user?userCode=${leave.userID}`,requestOptions);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch userName');
        }
        const userData = await userResponse.json();
        // console.log('Hello ')
        console.log(userData)
        // )
        // return { ...request, userName: userData.data.user[0].userName };
        const userName = userData.data.user.map(user => user.userName).join(', ');
      return { ...leave, userName };
      }));
      setLeaveData(leavesWithUsername);
      console.log(leavesWithUsername)
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

  const updateLeaveStage = async (id, newStage) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/leave/${id}/updateStage`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stage: newStage }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to update leave stage');
      }
      // Optionally, update local state or refetch data
      fetchData(); // Assuming fetchData fetches updated leave data
      toast.success('Leave stage updated successfully.');
    } catch (error) {
      console.error('Failed to update leave stage:', error);
      toast.error('Failed to update leave stage.');
    }
  };

  const updateNoOfDays = async (name, leaveType, days) => {
    try {
      // Fetch the leave types
      const response = await fetch(
        'http://localhost:3000/api/v1/admin/yearlyLeave/',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch leave types');
      }

      const data = await response.json();
      const leaveArray = data.data.leave;

      // Find the leave object with name === name
      const leaveObject = leaveArray.find((leave) => leave.leaveType === name);

      if (!leaveObject) {
        throw new Error(`Leave type '${name}' not found`);
      }

      const leaveID = leaveObject._id;

      // Use the leaveID to update noOfDays for the leave type
      const updateResponse = await fetch(
        `http://localhost:3000/api/v1/admin/yearlyLeave/${leaveID}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ leaveType, noOfDays: days }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error('Failed to update noOfDays for leave type');
      }

      const updatedData = await updateResponse.json();
      console.log(updatedData); // Log response data for update operation

      // Optionally handle success or refresh data
    } catch (error) {
      console.error('Failed to update noOfDays:', error.message);
      // Optionally show error message to user
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName='Leave' />
      {error && <p>Error: {error}</p>}
      <div className='rounded-sm border border-stroke bg-white px-5 pt-4 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 flex justify-end'>
        
      </div>
      <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
        <div className='max-w-full overflow-x-auto'>
          <table className='w-full table-auto'>
            <thead>
              <tr className='bg-gray-2 text-left dark:bg-meta-4'>
                <th className='min-w-[50px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11'>
                  S.No
                </th>
                <th className='min-w-[50px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11'>
                  User Name
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
                    onUpdateStage={(newStage) =>
                      updateLeaveStage(leave._id, newStage)
                    }
                    onUpdateNoOfDays={updateNoOfDays}
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

export default LeaveReport;
