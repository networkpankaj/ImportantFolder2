// import React from 'react';

// const formatDateToTime = (dateTimeString) => {
//   try {
//     const date = new Date(dateTimeString);
//     return date.toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   } catch (error) {
//     console.error(`Error parsing date "${dateTimeString}":`, error);
//     return 'Invalid Time';
//   }
// };

// const TimeCell = ({ dateTimeString }) => {
//   const formattedTime = formatDateToTime(dateTimeString);

//   return (
//     <p className='text-black dark:text-white'>
//       {formattedTime || 'Time Missing'}
//     </p>
//   );
// };

// export default TimeCell;



const formatTime = (dateTimeString) => {
  if (!dateTimeString) {
    return null;
  }
  const formattedTime = dateTimeString.substring(11, 16);
  return formattedTime;
};

const TimeCell = ({ dateTimeString }) => {
  const formattedTime = formatTime(dateTimeString);

  return (
    <p className='text-black dark:text-white'>
      {formattedTime || 'Time Missing'}
    </p>
  );
};

export default TimeCell;

