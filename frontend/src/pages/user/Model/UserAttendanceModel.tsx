import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define formatDate function before the component
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const Modal = ({
  onClose,
  isEdit,
  requestId,
  updateRequestData,
  attendance,
}) => {
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState({
    userID: attendance.userID || '',
    date: formatDate(attendance.clockInTime) || '',
    reason: '',
  });
  const modalRef = useRef();

  useEffect(() => {
    if (isEdit && requestId) {
      fetchRequest(requestId);
    } else {
      setLoading(false);
    }
    // fetchRequestTypes();
  }, [isEdit, requestId]);

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
      body: JSON.stringify(request),
    };
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/attendance-request`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`Failed to add request`);
      }
      const data = await response.json();

      toast(`Added request successfully`, data);
      updateRequestData(data);
      console.log(data);
     
      onClose();
    } catch (error) {
      toast.error(`Error adding request: ${error}`);
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
            <h1 className='text-3xl font-extrabold'>Request</h1>
            <form onSubmit={handleSubmit}>
              <input
                type='text'
                name='userCode'
                required
                className='w-full px-4 py-3 text-black border-gray-300 rounded-md'
                value={request.userID}
                onChange={(e) =>
                  setRequest({ ...request, userID: e.target.value })
                }
              />


              <div className='mt-5.5 mb-5.5 flex flex-col gap-5.5 sm:flex-row'>
                <div className='w-full '>
                  <div className='relative'>
                    <label
                      className=' block text-sm font-medium text-black dark:text-white'
                      htmlFor='Date'>
                      Date
                    </label>
                    <input
                      type='date'
                      placeholder='Date'
                      required
                      className='w-full px-4 py-3 mt-4 text-black border-gray-300 rounded-md'
                      value={request.date}
                      onChange={(e) =>
                        setRequest({ ...request, date: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <label
                className=' block text-sm font-medium text-black dark:text-white'
                htmlFor='reason'>
                Reason
              </label>
              <textarea
                name='reason'
                placeholder='Enter Reason'
                required
                className='w-full px-4 py-3 text-black border-gray-300 rounded-md'
                value={request.reason}
                onChange={(e) =>
                  setRequest({ ...request, reason: e.target.value })
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
