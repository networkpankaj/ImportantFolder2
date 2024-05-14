import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import UserLayout from '../../../layout/UserLayout';
import HolidayTableRow from '../Table/HolidayTableRow';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Holidays = () => {
  const [holidayData, setHolidayData] = useState([]);
  const [error, setError] = useState(null);
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

  return (
    <UserLayout>
      <Breadcrumb pageName='Holiday' />
      {error && <p>Error: {error}</p>}

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
                  Date
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
    </UserLayout>
  );
};

export default Holidays;
