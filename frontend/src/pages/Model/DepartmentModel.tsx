import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Modal = ({
  onClose,
  isEdit,
  departmentId,
  updateDepartmentData,
  fetchData,
}) => {
  const [departmentName, setDepartmentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const modalRef = useRef();

  useEffect(() => {
    if (isEdit && departmentId) {
      fetchDepartment(departmentId);
    } else {
      setLoading(false);
    }
  }, [isEdit, departmentId]);

  const fetchDepartment = async (id) => {
    try {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      const response = await fetch(
        `http://localhost:3000/api/v1/admin/department/${id}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error('Failed to fetch department');
      }

      const result = await response.json();
      setDepartmentName(result.data.department.departmentName);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error fetching department:', error);
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
        departmentName: departmentName,
      }),
    };
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/department${
          isEdit ? `/${departmentId}` : ''
        }`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`Failed to ${isEdit ? 'update' : 'add'} department`);
      }
      const data = await response.json();
      toast(`${isEdit ? 'Updated' : 'Added'} department successfully`, data);
      updateDepartmentData(data);
      fetchData();
      onClose();
    } catch (error) {
      toast.error(`Error ${isEdit ? 'updating' : 'adding'} department:`, error);
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
              {isEdit ? 'Edit Department' : 'Add a New Department'}
            </h1>
            <form onSubmit={handleSubmit}>
              <input
                type='text'
                name='departmentName'
                placeholder='Enter Department Name'
                required
                className='w-full px-4 py-3 text-black border-gray-300 rounded-md'
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
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
