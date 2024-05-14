import React from 'react';
import UserLayout from '../../../layout/UserLayout';
import DateCell from '../../../components/DateCell';

const HolidayTableRow = ({ holiday, index }) => {
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  return (
    <tr key={index + 1}>
      <td className='border-b border-[#eee] py-5 px-4 pl-5 dark:border-strokedark xl:pl-11'>
        <h5 className='font-medium text-black dark:text-white'>{index + 1}</h5>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p className='text-black dark:text-white'>
          {capitalizeFirstLetter(holiday.holidayName)}
        </p>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p className='text-black dark:text-white'>
          <DateCell dateTimeString={holiday.holidayDate} />
        </p>
      </td>
    </tr>
  );
};

export default HolidayTableRow;
