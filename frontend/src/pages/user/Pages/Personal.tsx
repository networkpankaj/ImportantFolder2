import UserLayout from '../../../layout/UserLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import userThree from '../../../images/user/user-03.png';
import React, { useState, useEffect, useCallback } from 'react';

const Settings = ({ user }) => {
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

  const [loading, setLoading] = useState(true);

  // const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/v1/user/personal-details?code=ISM10002'
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const jsonData = await response.json();
      if (jsonData.data) {
        setFormData(jsonData.data.user[0]);
        console.log(jsonData.data)
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Error: ' + error.message);
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

    const url = formData
      ? `http://localhost:3000/api/v1/user/personal-details?code=ISM10002`
      : `http://localhost:3000/api/v1/user/personal-details?code=ISM10002`;

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
      console.log(jsonData.data.attendance);

      // setFormData({
      //   fatherName: '',
      //   fatherOccupation: '',
      //   motherName: '',
      //   motherOccupation: '',
      //   spouseName: '',
      //   spouseOccupation: '',
      //   noOfChildren: '',
      //   fatherPhoneNumber: '',
      // });
      toast.success('Successfully added');
    } catch (error) {
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
  
console.log(formData)

  return (
    <UserLayout>
      <div className='mx-auto max-w-270'>
        <Breadcrumb pageName='Information' />

        <div className='grid grid-cols-5 gap-8'>
          <div className='col-span-5 xl:col-span-3'>
            <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
              <div className='border-b border-stroke py-4 px-7 dark:border-strokedark'>
                <h3 className='font-medium text-black dark:text-white'>
                  Family Information
                </h3>
              </div>
              <div className='p-7'>
                <form
                  action='#'
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
                        value={ formData.fatherOccupation}
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
                          value={ formData.motherName}
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
                        id='occupation'
                        placeholder='Mother Occupation'
                        defaultValue=''
                        onChange={handleChange}
                        value={ formData.motherOccupation}
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
                          value={ formData.spouseName}
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
                        value={ formData.spouseOccupation}
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
                          value={ formData.noOfChildren}
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
                       
                        value={ formData.fatherPhoneNumber}
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
          </div>
        
        </div>
      </div>
    </UserLayout>
  );
};

export default Settings;
