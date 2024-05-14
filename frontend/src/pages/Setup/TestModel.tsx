import React, { useRef, useState } from 'react';
import { X } from 'lucide-react';

const Modal = ({ onClose }) => {
  const [department, setDepartment] = useState();

  const modalRef = useRef();

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  const submit = (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      departmentName: department,
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch('http://localhost:3000/api/v1/admin/department', requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    onClose();
  };

  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center'>
      <div className='mt-10 flex flex-col gap-5 text-white'>
        <button
          onClick={onClose}
          className='place-self-end'>
          <X size={30} />
        </button>
        <div className='bg-indigo-600 rounded-xl px-20 py-10 flex flex-col gap-5 items-center mx-4'>
          <h1 className='text-3xl font-extrabold'>Departments</h1>
          <form onSubmit={submit}>
            <input
              type='text'
              name='department'
              placeholder='Enter Departments'
              required
              className='w-full px-4 py-3 text-black border-gray-300 rounded-md'
              onChange={(event) => setDepartment(event.target.value)}
              value={department}
            />
            <button className='mt-4 w-full font-medium rounded-md bg-black px-5 py-3'>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
