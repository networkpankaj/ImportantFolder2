import React, { useState } from 'react';
import DateCell from '../DateCell';

const leaveTableRow = ({
  leave,
  index,
  onEdit,
  onDelete,
  onActivate,
  onUpdateStage,
  onUpdateNoOfDays,
}) => {
  const [selectedStage, setSelectedStage] = useState(leave.stage);

  const handleStageChange = (event) => {
    // const newStage = parseInt(event.target.value); // Parse the selected value to an integer
    // setSelectedStage(newStage); // Update the local state with the new stage
    // onUpdateStage(newStage); // Call the onUpdateStage callback with the new stage value

    const newStage = parseInt(event.target.value);
    setSelectedStage(newStage);

    if (newStage === 1) {
      // Calculate number of days between startDate and endDate
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      const timeDifference = endDate.getTime() - startDate.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

      // Update the noOfDays in yearlyLeave for the corresponding leave type
      onUpdateNoOfDays(leave.leaveType, daysDifference);
    }

    // Call the onUpdateStage callback with the new stage value
    onUpdateStage(newStage);
    // console.log(newStage);
  };
  const handleEdit = () => {
    onEdit(leave._id);
  };

  const handleDelete = () => {
    onDelete(leave._id);
  };

  const handleActivate = () => {
    onActivate(leave._id);
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
          {leave.userName}
        </p>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p className='text-black dark:text-white'>
          {/* uppercase every word */}
          {leave.leaveType}
        </p>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p className='text-black dark:text-white'>
          <DateCell dateTimeString={leave.startDate} />
        </p>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p className='text-black dark:text-white'>
          {/* uppercase every word */}
          <DateCell dateTimeString={leave.endDate} />
        </p>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p className='text-black dark:text-white'>
          {/* uppercase every word */}
          {leave.reason}
        </p>
      </td>

      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <select
          className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
            selectedStage === 1
              ? 'bg-success text-success'
              : selectedStage === 0
              ? 'bg-danger text-danger'
              : 'bg-warning text-warning'
          }`}
          value={selectedStage}
          onChange={handleStageChange}>
          <option
            value={1}
            className='bg-success text-black dark:text-white'>
            Approved
          </option>
          <option
            value={0}
            className='bg-danger text-black dark:text-white'>
            Rejected
          </option>
          <option
            value={-1}
            className='bg-warning text-black dark:text-white'>
            Pending
          </option>
        </select>
      </td>
    </tr>
  );
};

export default leaveTableRow;
