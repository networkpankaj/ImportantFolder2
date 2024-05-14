import React from 'react';

const leaveDetailsTableRow = ({ leave, index }) => {
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
          {leave.leaveType}
        </p>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p className='text-black dark:text-white'>{leave.noOfLeave}</p>
      </td>
    </tr>
  );
};

export default leaveDetailsTableRow;
