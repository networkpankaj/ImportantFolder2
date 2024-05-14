import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Modal = ({ onClose, userId }) => {
  const [formData, setFormData] = useState({
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    spouseName: '',
    spouseOccupation: '',
    noOfChildren: '',
    fatherPhoneNumber: '',
  });

  const modalRef = useRef();
  const [loading, setLoading] = useState(false);

  const fetchPersonalData = async (userId) => {
    try {
      const requestOptions = {
        method: 'GET',
        credentials: 'include',
      };

      const userResponse = await fetch(`http://localhost:3000/api/v1/user/${userId}`, requestOptions);

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await userResponse.json();
      const userCode = userData.data.user.userCode || [];

      const personalResponse = await fetch(
        `http://localhost:3000/api/v1/user/personal-details?code=${userCode}`,
        requestOptions
      );

      if (!personalResponse.ok) {
        throw new Error('Failed to fetch personal data');
      }
      const fetchedPersonalData = await personalResponse.json();
      console.log(fetchedPersonalData);

      return { userCode, personalData: fetchedPersonalData.data.user || [] };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const { userCode, personalData } = await fetchPersonalData(userId);
        console.log(userCode)
        console.log(personalData);
        setFormData(personalData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { userCode } = await fetchPersonalData(userId);
    const url = formData ? `http://localhost:3000/api/v1/user/personal-details?code=${userCode}`: `http://localhost:3000/api/v1/user/personal-details?code=${userCode}`;
    const method = formData ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to store data');
      }
      const jsonData = await response.json();
      console.log(jsonData.data);

      toast.success('Successfully added');
    }catch (error) {
      toast.error('Error: ' + error.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      fatherName: '',
      fatherOccupation: '',
      motherName: '',
      motherOccupation: '',
      spouseName: '',
      spouseOccupation: '',
      noOfChildren: '',
      fatherPhoneNumber: '',
    });
  };

  if (loading) {
    return <div>Loading...</div>;
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
              {/* {isEdit ? 'Edit user' : 'Edit Family Information'} */}
              Family Information
            </h1>
            <form 
                 >
                  <div className='mb-5.5 flex flex-col gap-5.5 sm:flex-row'>
                    <div className='w-full sm:w-1/2'>
                      <label
                        className='mb-3 block text-sm font-medium text-black dark:text-white'
                        htmlFor='fullName'>
                        Father Name
                      </label>
                      <div className='relative'>
                        <span className='absolute left-4.5 top-4'>
                          
                        </span>
                        <input
                          className='w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary'
                          type='text'
                          name='fatherName'
                          id='fullName'
                          placeholder='Father Name'
                          defaultValue=''
                          onChange={handleChange}
                          value={formData.fatherName}
                        />
                      </div>
                    </div>

                    <div className='w-full sm:w-1/2'>
                      <label
                        className='mb-3 block text-sm font-medium text-black dark:text-white'
                        htmlFor='phoneNumber'>
                        Father Occupation
                      </label>
                      <input
                        className='w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary'
                        type='text'
                        name='fatherOccupation'
                        id='occupation'
                        placeholder='Father occupation'
                        defaultValue=''
                        onChange={handleChange}
                        value={formData.fatherOccupation}
                      />
                    </div>
                  </div>
                  <div className='mb-5.5 flex flex-col gap-5.5 sm:flex-row'>
                    <div className='w-full sm:w-1/2'>
                      <label
                        className='mb-3 block text-sm font-medium text-black dark:text-white'
                        htmlFor='fullName'>
                        Mother Name
                      </label>
                      <div className='relative'>
                        <span className='absolute left-4.5 top-4'>
                          
                        </span>
                        <input
                          className='w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary'
                          type='text'
                          name='motherName'
                          id='fullName'
                          placeholder='Mother Name'
                          defaultValue=''
                          onChange={handleChange}
                          value={formData.motherName}
                        />
                      </div>
                    </div>

                    <div className='w-full sm:w-1/2'>
                      <label
                        className='mb-3 block text-sm font-medium text-black dark:text-white'
                        htmlFor='phoneNumber'>
                        Mother Occupation
                      </label>
                      <input
                        className='w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary'
                        type='text'
                        name='motherOccupation'
                        id='Occupation'
                        placeholder='Mother Occupation'
                        defaultValue=''
                        onChange={handleChange}
                        value={formData.motherOccupation}
                      />
                    </div>
                  </div>
                  <div className='mb-5.5 flex flex-col gap-5.5 sm:flex-row'>
                    <div className='w-full sm:w-1/2'>
                      <label
                        className='mb-3 block text-sm font-medium text-black dark:text-white'
                        htmlFor='fullName'>
                        Spouse Name
                      </label>
                      <div className='relative'>
                        <span className='absolute left-4.5 top-4'>
                          
                        </span>
                        <input
                          className='w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary'
                          type='text'
                          name='spouseName'
                          id='fullName'
                          placeholder='Spouse Name'
                          defaultValue=''
                          onChange={handleChange}
                          value={formData.spouseName}
                        />
                      </div>
                    </div>

                    <div className='w-full sm:w-1/2'>
                      <label
                        className='mb-3 block text-sm font-medium text-black dark:text-white'
                        htmlFor='phoneNumber'>
                        Spouse Occupation
                      </label>
                      <input
                        className='w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary'
                        type='text'
                        name='spouseOccupation'
                        id='Occupation'
                        placeholder='Spouse Occupation'
                        defaultValue=''
                        onChange={handleChange}
                        value={formData.spouseOccupation}
                      />
                    </div>
                  </div>
                  <div className='mb-5.5 flex flex-col gap-5.5 sm:flex-row'>
                    <div className='w-full sm:w-1/2'>
                      <label
                        className='mb-3 block text-sm font-medium text-black dark:text-white'
                        htmlFor='fullName'>
                        noOfChildren
                      </label>
                      <div className='relative'>
                        <span className='absolute left-4.5 top-4'>
                          
                        </span>
                        <input
                          className='w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary'
                          type='number'
                          name='noOfChildren'
                          id='children'
                          placeholder='number of children'
                          defaultValue=''
                          onChange={handleChange}
                          value={formData.noOfChildren}
                        />
                      </div>
                    </div>

                    <div className='w-full sm:w-1/2'>
                      <label
                        className='mb-3 block text-sm font-medium text-black dark:text-white'
                        htmlFor='phoneNumber'>
                        Father Phone Number
                      </label>
                      <input
                        className='w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary'
                        type='text'
                        name='fatherPhoneNumber'
                        id='phoneNumber'
                        placeholder='Phone Number'
                        defaultValue=''
                        onChange={handleChange}
                        value={formData.fatherPhoneNumber}
                      />
                    </div>
                  </div>

                  <div className='flex justify-end gap-4.5'>
                    <button
                      className='flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white'
                      type='submit' onClick={handleCancel}>
                        
                      Cancel
                    </button>
                    <button
                      className='flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90'
                      type='submit' onClick={handleSubmit}>
                      
                      Save
                    </button>
                  </div>
                </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;