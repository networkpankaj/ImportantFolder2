import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Modal = ({ onClose, isEdit, roleId, updateRoleData, fetchData }) => {
  const [roleName, setRoleName] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const modalRef = useRef();

  useEffect(() => {
    if (isEdit && roleId) {
      fetchRole(roleId);
    } else {
      setLoading(false);
    }
  }, [isEdit, roleId]);

  const fetchRole = async (id) => {
    try {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      const response = await fetch(
        `http://localhost:3000/api/v1/admin/role/${id}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error('Failed to fetch role');
      }

      const result = await response.json();
      setRoleName(result.data.role.userRoleName);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error fetching role:', error);
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
        userRoleName: roleName,
      }),
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/role${isEdit ? `/${roleId}` : ''}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`Failed to ${isEdit ? 'update' : 'add'} role`);
      }

      const data = await response.json();
      console.log(`${isEdit ? 'Updated' : 'Added'} role successfully`, data);
      toast(`${isEdit ? 'Updated' : 'Added'} role successfully`, data);

      updateRoleData(data);
      fetchData();

      onClose();
    } catch (error) {
      toast.error(`Error ${isEdit ? 'updating' : 'adding'} role:`, error);
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
              {isEdit ? 'Edit Role' : 'Add a New Role'}
            </h1>
            <form onSubmit={handleSubmit}>
              <input
                type='text'
                name='roleName'
                placeholder='Enter Role Name'
                required
                className='w-full px-4 py-3 text-black border-gray-300 rounded-md'
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
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
