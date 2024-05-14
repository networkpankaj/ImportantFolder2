// import React from 'react';
// import TimeCell from '../../../components/TimeCell';

// const attendanceTableRow = ({
//   attendance,
//   index,
//   onEdit,
//   onDelete,
//   onActivate,
// }) => {
//   const handleEdit = () => {
//     onEdit(attendance._id);
//   };

//   const handleDelete = () => {
//     onDelete(attendance._id);
//   };

//   const handleActivate = () => {
//     onActivate(attendance._id);
//   };

//   const capitalizeFirstLetter = (str) => {
//     return str.charAt(0).toUpperCase() + str.slice(1);
//   };

//   return (
//     <tr key={index + 1}>
//       <td className='border-b border-[#eee] py-5 px-4 pl-5 dark:border-strokedark xl:pl-11'>
//         <h5 className='font-medium text-black dark:text-white'>{index + 1}</h5>
//       </td>
//       <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
//         <p className='text-black dark:text-white'>
//           {/* uppercase every word */}
//           {attendance.userID}
//         </p>
//       </td>
//       <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
//         <p className='text-black dark:text-white'>
//           <TimeCell dateTimeString={attendance.clockInTime} />
//         </p>
//       </td>
//       <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
//         <p className='text-black dark:text-white'>
//           <TimeCell dateTimeString={attendance.clockInTime} />
//         </p>
//       </td>
//       <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
//         <p className='text-black dark:text-white'>
//           {/* uppercase every word */}
//           {attendance.workingHour}
//         </p>
//       </td>
//     </tr>
//   );
// };

// export default attendanceTableRow;

import React, { useState } from 'react';
import TimeCell from '../../../components/TimeCell';
import DateCell from '../../../components/DateCell';
import Modal from '../Model/UserAttendanceModel';

const attendanceTableRow = ({
  attendance,
  index,
  onEdit,
  onDelete,
  onActivate,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [requestData, setRequestData] = useState([]);
  const [requestId, setRequestId] = useState(null);
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

  const openAddRequestModal = () => {
    setIsEdit(false);
    setShowModal(true);
  };

  const editRequest = (id) => {
    console.log('heloo');
    console.log(id);
    setRequestId(id);
    setIsEdit(true);
    setShowModal(true);
  };

  return (
    <tr key={index + 1}>
      <td className='border-b border-[#eee] py-5 px-4 pl-5 dark:border-strokedark xl:pl-11'>
        <h5 className='font-medium text-black dark:text-white'>{index + 1}</h5>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p className='text-black dark:text-white'>
          {/* uppercase every word */}
          <DateCell dateTimeString={attendance.clockInTime} />
        </p>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p className='text-black dark:text-white'>
          <TimeCell dateTimeString={attendance.clockInTime} />
        </p>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p className='text-black dark:text-white'>
          <TimeCell dateTimeString={attendance.clockOutTime} />
        </p>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p className='text-black dark:text-white'>{attendance.workingHour}</p>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <div>
          <button
            onClick={openAddRequestModal}
            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>
            {' '}
            Apply{' '}
          </button>
          {showModal && (
            <Modal
              attendance={attendance}
              onClose={() => setShowModal(false)}
              isEdit={isEdit}
              requestId={requestId}
              updateRequestData={setRequestData}
            />
          )}
        </div>
      </td>
    </tr>
  );
};

export default attendanceTableRow;

