import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Modal = ({
  onClose,
  isEdit,
  holidayId,
  updateHolidayData,
  fetchData,
}) => {
  const [holidayName, setHolidayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [holidayDate, setHolidayDate] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);

  const modalRef = useRef();

  useEffect(() => {
    if (isEdit && holidayId) {
      fetchHoliday(holidayId);
    } else {
      setLoading(false);
    }
  }, [isEdit, holidayId]);

  const fetchHoliday = async (id) => {
    try {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      const response = await fetch(
        `http://localhost:3000/api/v1/admin/holiday/${id}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error('Failed to fetch holiday');
      }

      const result = await response.json();
      setHolidayName(result.data.holiday.holidayName);
      // setHolidayDate(result.data.holiday.holidayDate);
      setHolidayDate(
        new Date(result.data.holiday.holidayDate).toISOString().split('T')[0]
      );

      console.log(result.data.holiday.holidayDate);
    } catch (error) {
      console.error('Error fetching holiday:', error);
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
        holidayName: holidayName,
        holidayDate: holidayDate,
      }),
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/holiday${
          isEdit ? `/${holidayId}` : ''
        }`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`Failed to ${isEdit ? 'update' : 'add'} holiday`);
      }

      const data = await response.json();
      console.log(`${isEdit ? 'Updated' : 'Added'} holiday successfully`, data);
      onClose();
      toast(`${isEdit ? 'Updated' : 'Added'} holiday successfully`, data);
      updateHolidayData(data);
      fetchData();
      onClose();
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'adding'} holiday:`, error);
      toast.error(`Error ${isEdit ? 'updating' : 'adding'} holiday:`, error);
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
              {isEdit ? 'Edit Holiday' : 'Add a New Holiday'}
            </h1>
            <form onSubmit={handleSubmit}>
              <input
                type='text'
                name='holidayName'
                placeholder='Enter Holiday Name'
                required
                className='w-full px-4 py-3 text-black border-gray-300 rounded-md'
                value={holidayName}
                onChange={(e) => setHolidayName(e.target.value)}
              />
              <input
                type='date'
                placeholder='Holiday Date'
                required
                className='w-full px-4 py-3 mt-4 text-black border-gray-300 rounded-md'
                value={holidayDate}
                onChange={(e) => setHolidayDate(e.target.value)}
              />
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
