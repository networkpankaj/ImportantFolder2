// import React from 'react';

// const formatDateDMY = (dateTimeString) => {
//   try {
//     const date = new Date(dateTimeString);
//     const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with zero if needed
//     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (zero-based index) and pad with zero if needed
//     const year = date.getFullYear(); // Get full year

//     return `${day}/${month}/${year}`; // Return formatted date string
//   } catch (error) {
//     console.error(`Error parsing date "${dateTimeString}":`, error);
//     return 'Invalid Date';
//   }
// };

// const DateCell = ({ dateTimeString }) => {
//   const formattedDate = formatDateDMY(dateTimeString);

//   return (
//     <p className='text-black dark:text-white'>
//       {formattedDate || 'Date Missing'}
//     </p>
//   );
// };

// export default DateCell;



const formatDateDMY = (dateTimeString) => {
  try {
    if (!dateTimeString) {
      return null;
    }
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with zero if needed
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (zero-based index) and pad with zero if needed
    const year = date.getFullYear(); // Get full year

    return `${day}-${month}-${year}`; // Return formatted date string
  } catch (error) {
    console.error(`Error parsing date "${dateTimeString}":`, error);
    return 'Invalid Date';
  }
};

const DateCell = ({ dateTimeString }) => {
  const formattedDate = formatDateDMY(dateTimeString);

  return (
    <p className='text-black dark:text-white'>
      {formattedDate || 'Date Missing'}
    </p>
  );
};

export default DateCell;

