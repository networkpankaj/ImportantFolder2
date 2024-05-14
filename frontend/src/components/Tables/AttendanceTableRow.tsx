import React from 'react';
import TimeCell from '../TimeCell';

const attendanceTableRow = ({
  attendance,
  index,
  onEdit,
  onDelete,
  onActivate,
}) => {
  const handleEdit = () => {
    onEdit(attendance._id);
  };

  const handleDelete = () => {
    onDelete(attendance._id);
  };

  const handleActivate = () => {
    onActivate(attendance._id);
  };

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
          {/* uppercase every word */}
          {attendance.userID}
        </p>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p className='text-black dark:text-white'>
          <TimeCell dateTimeString={attendance.clockInTime} />
        </p>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p className='text-black dark:text-white'>
          <TimeCell dateTimeString={attendance.clockInTime} />
        </p>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p className='text-black dark:text-white'>
          {/* uppercase every word */}
          {attendance.workingHour}
        </p>
      </td>
    </tr>
  );
};

export default attendanceTableRow;
