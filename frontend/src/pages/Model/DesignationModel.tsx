import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Modal = ({
  onClose,
  isEdit,
  designationId,
  updateDesignationData,
  fetchData,
}) => {
  const [designationName, setDesignationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const modalRef = useRef();

  useEffect(() => {
    if (isEdit && designationId) {
      fetchDesignation(designationId);
    } else {
      setLoading(false);
    }
  }, [isEdit, designationId]);

  const fetchDesignation = async (id) => {
    try {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      const response = await fetch(
        `http://localhost:3000/api/v1/admin/designation/${id}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error('Failed to fetch designation');
      }

      const result = await response.json();
      setDesignationName(result.data.designation.designationName);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error fetching designation:', error);
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
        designationName: designationName,
      }),
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/designation${
          isEdit ? `/${designationId}` : ''
        }`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`Failed to ${isEdit ? 'update' : 'add'} designation`);
      }

      const data = await response.json();
      toast(`${isEdit ? 'Updated' : 'Added'} designation successfully`, data);
      updateDesignationData(data);
      fetchData();
      onClose();
    } catch (error) {
      toast.error(
        `Error ${isEdit ? 'updating' : 'adding'} designation:`,
        error
      );
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
              {isEdit ? 'Edit Designation' : 'Add a New Designation'}
            </h1>
            <form onSubmit={handleSubmit}>
              <input
                type='text'
                name='designationName'
                placeholder='Enter Designation Name'
                required
                className='w-full px-4 py-3 text-black border-gray-300 rounded-md'
                value={designationName}
                onChange={(e) => setDesignationName(e.target.value)}
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
