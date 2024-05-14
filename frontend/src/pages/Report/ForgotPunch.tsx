import  { useState, useEffect } from 'react';

import Modal from '../../pages/Model/RequestModel'

import LeaveTableRow from '../../components/Tables/RequestTableRowAdmin';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';

const ForgotPunch = () => {
  const [requestData, setRequestData] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [requestId, setRequestId] = useState(null);


  const fetchData = async () => {
    try {
      const requestOptions = {
        method: 'GET',
        credentials: 'include', // Include cookies in cross-origin requests
      };
      const response = await fetch('http://localhost:3000/api/v1/attendance-request',requestOptions);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      // setRequestData(result.data.Request || []);
      // console.log(result.data.Request)

      const requestsWithUsername = await Promise.all(result.data.Request.map(async (request) => {
        const userResponse = await fetch(`http://localhost:3000/api/v1/user?userCode=${request.userID}`,requestOptions);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch userName');
        }
        const userData = await userResponse.json();
        // console.log('Hello ')
        // console.log(userData.data.user)
        // )
        // return { ...request, userName: userData.data.user[0].userName };
        const userName = userData.data.user.map(user => user.userName).join(', ');
      return { ...request, userName };
      }));
      setRequestData(requestsWithUsername);
      console.log(requestsWithUsername)
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
      toast('Request deleted successfully.', 'success');
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
      toast.success('Request activated successfully.');
    } catch (error) {
      console.error('Failed to activate request:', error);
      toast.error('Failed to activate request.');
    }
  };


  const updateRequestStage = async (id, newStage) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/attendance-request/${id}/updateStage`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stage: newStage }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to update request stage');
      }
     
      fetchData(); 
      toast.success('request stage updated successfully.');
    } catch (error) {
      console.error('Failed to update request stage:', error);
      toast.error('Failed to update request stage.');
    }
  };


  return (
    <DefaultLayout>
      <Breadcrumb pageName='Forgot Punch' />
   
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
                
                 <th className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white'>
                  Date
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
              {requestData && requestData.length > 0 ? (
                requestData.map((request, index) => (
                  <LeaveTableRow
                    key={index}
                    request={request}
                    index={index}
                    onEdit={() => editRequest(request._id)}
                    onDelete={deleteRequest}
                    onActivate={activateRequest}
                    onUpdateStage={(newStage) =>
                      updateRequestStage(request._id, newStage)
                    }
                    // onUpdateNoOfDays={updateNoOfDays}
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
    </DefaultLayout>
  );
};

export default ForgotPunch;
