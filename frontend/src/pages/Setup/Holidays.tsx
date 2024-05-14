import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Modal from '../Model/HolidayModel';
import HolidayTableRow from '../../components/Tables/HolidayTableRow';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Holidays = () => {
  const [holidayData, setHolidayData] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [holidayId, setHolidayId] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(
  //         'http://localhost:3000/api/v1/admin/holiday'
  //       );
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch data');
  //       }
  //       const result = await response.json();
  //       setHolidayData(result.data.holiday || []);
  //     } catch (error) {
  //       setError(error.message);
  //     }
  //   };

  //   fetchData();
  // }, []);
  const fetchData = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/v1/admin/holiday'
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setHolidayData(result.data.holiday || []);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddUserModal = () => {
    setIsEdit(false);
    setShowModal(true);
  };

  const editHoliday = (id) => {
    setHolidayId(id);
    setIsEdit(true);
    setShowModal(true);

    // Implement edit functionality
  };

  const deleteHoliday = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/holiday/${id}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete holiday');
      }
      setHolidayData((prevData) =>
        prevData.map((holiday) =>
          holiday._id === id ? { ...holiday, status: 'inactive' } : holiday
        )
      );
      toast('Holiday deleted successfully.', 'success');
      // Handle success (e.g., update holidayData state)
    } catch (error) {
      console.error('Failed to delete holiday:', error);
    }
  };

  const activateHoliday = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/holiday/${id}/activate`,
        {
          method: 'PATCH',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to activate holiday');
      }
      fetchData();
      toast.success('Holiday activated successfully.');
      // Handle success (e.g., update holidayData state)
    } catch (error) {
      console.error('Failed to activate holiday:', error);
      toast.error('Failed to activate holiday.');
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName='Holiday' />
      {error && <p>Error: {error}</p>}
      <div className='rounded-sm border border-stroke bg-white px-5 pt-4 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 flex justify-end'>
        <div>
          <button
            onClick={openAddUserModal}
            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>
            {' '}
            Add New{' '}
          </button>
          {showModal && (
            <Modal
              onClose={() => setShowModal(false)}
              isEdit={isEdit}
              holidayId={holidayId}
              updateHolidayData={setHolidayData}
              fetchData={fetchData}
            />
          )}
        </div>
      </div>
      <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
        <div className='max-w-full overflow-x-auto'>
          <table className='w-full table-auto'>
            <thead>
              <tr className='bg-gray-2 text-left dark:bg-meta-4'>
                <th className='min-w-[50px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11'>
                  S.No
                </th>
                <th className='min-w-[150px] py-4 px-4 font-medium text-black dark:text-white'>
                  Name
                </th>
                <th className='min-w-[150px] py-4 px-4 font-medium text-black dark:text-white'>
                  Name
                </th>
                <th className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white'>
                  Status
                </th>
                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {holidayData && holidayData.length > 0 ? (
                holidayData.map((holiday, index) => (
                  <HolidayTableRow
                    key={index}
                    holiday={holiday}
                    index={index}
                    onEdit={() => editHoliday(holiday._id)}
                    onDelete={deleteHoliday}
                    onActivate={activateHoliday}
                  />
                ))
              ) : (
                <p className='flex justify-center items-end text-xl w-full'>
                  No Designation Data Found
                </p>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Holidays;
