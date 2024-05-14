import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Modal = ({ onClose, isEdit, leaveId, updateLeaveData, fetchData }) => {
  const [leaveName, setLeaveName] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [leaveType, setLeaveType] = useState();
  const [leaveStartDate, setLeaveStartDate] = useState();
  const [leaveEndDate, setLeaveEndDate] = useState();
  const [leaveReason, setLeaveReason] = useState();
  const [userId, setUserId] = useState();

  const modalRef = useRef();

  useEffect(() => {
    if (isEdit && leaveId) {
      fetchLeave(leaveId);
    } else {
      setLoading(false);
    }
  }, [isEdit, leaveId]);

  const fetchLeave = async (id) => {
    try {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      const response = await fetch(
        `http://localhost:3000/api/v1/admin/leave/${id}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error('Failed to fetch leave');
      }

      const result = await response.json();
      setLeaveName(result.data.leave);
      //   console.log(result.data.leave.userID);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error fetching leave:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: isEdit ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID: userId,
        leaveType: leaveType,
        startDate: leaveStartDate,
        endDate: leaveEndDate,
        reason: leaveReason,
      }),
    };
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/leave${
          isEdit ? `/${leaveId}` : ''
        }`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`Failed to ${isEdit ? 'update' : 'add'} leave`);
      }
      const data = await response.json();
      toast(`${isEdit ? 'Updated' : 'Added'} leave successfully`, data);
      updateLeaveData(data);
      fetchData();
      onClose();
    } catch (error) {
      toast.error(`Error ${isEdit ? 'updating' : 'adding'} leave:`, error);
    }
  };

  function getDateFromISOString(ISOString) {
    try {
      // Create a Date object from the provided ISO 8601 string
      const dateObject = new Date(ISOString);

      // Extract the date components (year, month, day)
      const year = dateObject.getUTCFullYear();
      const month = `0${dateObject.getUTCMonth() + 1}`.slice(-2); // Add leading zero if necessary
      const day = `0${dateObject.getUTCDate()}`.slice(-2); // Add leading zero if necessary

      // Format the date as YYYY-MM-DD
      const formattedDate = `${year}-${month}-${day}`;

      return formattedDate;
    } catch (error) {
      console.error('Error parsing date:', error);
      return null; // Return null if there's an error parsing the date
    }
  }

  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center'>
      {loading ? (
        'Loading...'
      ) : (
        <div className='mt-10 flex flex-col gap-5 text-white'>
          <button
            onClick={onClose}
            className='place-self-end'>
            <X size={30} />
          </button>
          <div className='bg-indigo-600 rounded-xl px-20 py-10 flex flex-col gap-5 items-center mx-4'>
            <h1 className='text-3xl font-extrabold'>
              {isEdit ? 'Edit leave' : 'Request For a Leave'}
            </h1>
            <form onSubmit={handleSubmit}>
              <input
                type='text'
                name='userCode'
                placeholder='Enter leave Name'
                required
                className='w-full px-4 py-3 text-black border-gray-300 rounded-md'
                value={leaveName._id}
                onChange={(e) => setUserId(e.target.value)}
                // hidden
              />
              <label
                className=' block text-sm font-medium text-black dark:text-white'
                htmlFor='phoneNumber'>
                Leave Type
              </label>
              <input
                type='text'
                name='leaveName'
                placeholder='Enter leave Name'
                required
                className='w-full px-4 py-3 text-black border-gray-300 rounded-md'
                value={leaveName.leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
              />
              <div className='mt-5.5 mb-5.5 flex flex-col gap-5.5 sm:flex-row'>
                <div className='w-full sm:w-1/2'>
                  <div className='relative'>
                    <label
                      className=' block text-sm font-medium text-black dark:text-white'
                      htmlFor='phoneNumber'>
                      Start Date
                    </label>
                    <input
                      type='date'
                      placeholder='Holiday Date'
                      required
                      className='w-full px-4 py-3 mt-4 text-black border-gray-300 rounded-md'
                      value={getDateFromISOString(leaveName.startDate)}
                      onChange={(e) => setLeaveStartDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className='w-full sm:w-1/2'>
                  <label
                    className=' block text-sm font-medium text-black dark:text-white'
                    htmlFor='phoneNumber'>
                    End Date
                  </label>

                  <input
                    type='date'
                    placeholder='Holiday Date'
                    required
                    className='w-full px-4 py-3 mt-4 text-black border-gray-300 rounded-md'
                    value={getDateFromISOString(leaveName.endDate)}
                    onChange={(e) => setLeaveEndDate(e.target.value)}
                  />
                </div>
              </div>
              <label
                className=' block text-sm font-medium text-black dark:text-white'
                htmlFor='phoneNumber'>
                Reason
              </label>
              <textarea
                name='reason'
                placeholder='Enter leave Reason'
                required
                className='w-full px-4 py-3 text-black border-gray-300 rounded-md'
                value={leaveName.reason}
                onChange={(e) => setLeaveReason(e.target.value)}></textarea>

              <button
                type='submit'
                className='mt-4 w-full font-medium rounded-md bg-black px-5 py-3'>
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
