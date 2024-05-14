import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Modal = ({ onClose, isEdit, leaveId, updateLeaveData, fetchData }) => {
  const [loading, setLoading] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leave, setLeave] = useState({
    userID: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const modalRef = useRef();

  useEffect(() => {
    if (isEdit && leaveId) {
      fetchLeave(leaveId);
    } else {
      setLoading(false);
    }
    fetchLeaveTypes();
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
      setLeave(result.data.leave);
      //   console.log(result.data.leave);
    } catch (error) {
      console.error('Error fetching leave:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveTypes = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/v1/admin/yearlyLeave'
      );
      if (!response.ok) {
        throw new Error('Failed to fetch leave types');
      }
      const result = await response.json();

      // Check if result.data is an array before setting leaveTypes
      if (Array.isArray(result.data.leave)) {
        setLeaveTypes(result.data.leave);
      } else {
        console.error('Invalid leave types data:', result.data);
      }
    } catch (error) {
      console.error('Error fetching leave types:', error);
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
      body: JSON.stringify(leave),
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
                // placeholder='Enter leave Name'
                required
                className='w-full px-4 py-3 text-black border-gray-300 rounded-md'
                value={isEdit ? leave._id : leave.userID}
                onChange={(e) =>
                  setLeave({
                    ...leave,
                    [isEdit ? 'leaveId' : 'userID']: e.target.value,
                  })
                }
              />
              <label
                className=' block text-sm font-medium text-black dark:text-white'
                htmlFor='leaveType'>
                Leave Type
              </label>
              <select
                name='leaveType'
                className='w-full px-4 py-3 text-black border-gray-300 rounded-md'
                value={leave.leaveType}
                onChange={(e) =>
                  setLeave({ ...leave, leaveType: e.target.value })
                }>
                <option value=''>Select Leave Type</option>
                {leaveTypes.map((type) => (
                  <option
                    key={type._id}
                    value={type.leaveType}>
                    {type.leaveType}
                  </option>
                ))}
              </select>
              <div className='mt-5.5 mb-5.5 flex flex-col gap-5.5 sm:flex-row'>
                <div className='w-full sm:w-1/2'>
                  <div className='relative'>
                    <label
                      className=' block text-sm font-medium text-black dark:text-white'
                      htmlFor='startDate'>
                      Start Date
                    </label>
                    <input
                      type='date'
                      placeholder='Start Date'
                      required
                      className='w-full px-4 py-3 mt-4 text-black border-gray-300 rounded-md'
                      value={leave.startDate}
                      onChange={(e) =>
                        setLeave({ ...leave, startDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className='w-full sm:w-1/2'>
                  <label
                    className=' block text-sm font-medium text-black dark:text-white'
                    htmlFor='endDate'>
                    End Date
                  </label>

                  <input
                    type='date'
                    placeholder='End Date'
                    required
                    className='w-full px-4 py-3 mt-4 text-black border-gray-300 rounded-md'
                    value={leave.endDate}
                    onChange={(e) =>
                      setLeave({ ...leave, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <label
                className=' block text-sm font-medium text-black dark:text-white'
                htmlFor='reason'>
                Reason
              </label>
              <textarea
                name='reason'
                placeholder='Enter leave Reason'
                required
                className='w-full px-4 py-3 text-black border-gray-300 rounded-md'
                value={leave.reason}
                onChange={(e) =>
                  setLeave({ ...leave, reason: e.target.value })
                }></textarea>

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
