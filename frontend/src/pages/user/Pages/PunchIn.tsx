// import React, { useState, useEffect, useCallback } from 'react';
// // import DefaultLayout from '../../layout/DefaultLayout';
// import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
// // import Modal from '../Model/DepartmentModel';
// import AttendanceTableRow from '../Table/PunchInModel';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import UserLayout from '../../../layout/UserLayout';

// const Departments = () => {
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [error, setError] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const [isEdit, setIsEdit] = useState(false);
//   const [attendanceId, setAttendanceId] = useState(null);
//   const [alertMessage, setAlertMessage] = useState('');
//   const [alertVisible, setAlertVisible] = useState(false);

//   const fetchData = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/api/v1/attendance');
//       if (!response.ok) {
//         throw new Error('Failed to fetch data');
//       }
//       const result = await response.json();
//       setAttendanceData(result.data.attendance || []);
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const openAddUserModal = () => {
//     setIsEdit(false);
//     setShowModal(true);
//   };

//   const editAttendance = (id) => {
//     setAttendanceId(id);
//     setIsEdit(true);
//     setShowModal(true);
//   };

//   const deleteAttendance = async (id) => {
//     try {
//       const response = await fetch(
//         `http://localhost:3000/api/v1/admin/department/${id}`,
//         {
//           method: 'DELETE',
//         }
//       );
//       if (!response.ok) {
//         throw new Error('Failed to delete department');
//       }
//       // yaha pe update kar raha hu department ko active se inactive
//       setDepartmentData((prevData) =>
//         prevData.map((department) =>
//           department._id === id
//             ? { ...department, status: 'inactive' }
//             : department
//         )
//       );
//       toast('Department deleted successfully.', 'success');
//     } catch (error) {
//       console.error('Failed to delete department:', error);
//     }
//   };
//   const activateAttendance = async (id) => {
//     try {
//       const response = await fetch(
//         `http://localhost:3000/api/v1/admin/department/${id}/activate`,
//         {
//           method: 'PATCH',
//         }
//       );
//       if (!response.ok) {
//         throw new Error('Failed to activate department');
//       }
//       fetchData();
//       toast.success('Department activated successfully.');
//     } catch (error) {
//       console.error('Failed to activate department:', error);
//       toast.error('Failed to activate department.');
//     }
//   };

//   //alert messages
//   const handleAlert = (message, type) => {
//     setAlertMessage(message);
//     setAlertType(type);
//     setAlertVisible(true);
//     setTimeout(() => {
//       setAlertVisible(false);
//     }, 3000);
//   };

//   return (
//     <UserLayout>
//       {/* <Breadcrumb pageName='Clock In' /> */}
//       {error && <p>Error: {error}</p>}

//       {alertVisible && (
//         <div className={`alert-${alertType}`}>
//           {alertType === 'success' && <AlertSuccess message={alertMessage} />}
//           {alertType === 'warning' && <AlertWarning message={alertMessage} />}
//           {alertType === 'error' && <AlertError message={alertMessage} />}
//         </div>
//       )}
//       <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
//         <div className='max-w-full overflow-x-auto'>
//           <table className='w-full table-auto'>
//             <thead>
//               <tr className='bg-gray-2 text-left dark:bg-meta-4'>
//                 <th className='min-w-[50px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11'>
//                   S.No
//                 </th>
//                 <th className='min-w-[150px] py-4 px-4 font-medium text-black dark:text-white'>
//                   userID
//                 </th>
//                 <th className='min-w-[150px] py-4 px-4 font-medium text-black dark:text-white'>
//                   In Time
//                 </th>
//                 <th className='min-w-[150px] py-4 px-4 font-medium text-black dark:text-white'>
//                   Out Time
//                 </th>
//                 <th className='min-w-[150px] py-4 px-4 font-medium text-black dark:text-white'>
//                   Working Hours
//                 </th>
//                 {/* <th className='min-w-[120px] py-4 px-4 font-medium text-black dark:text-white'>
//                   Status
//                 </th> */}
//                 {/* <th className='py-4 px-4 font-medium text-black dark:text-white'>
//                   Actions
//                 </th> */}
//               </tr>
//             </thead>
//             <tbody>
//               {attendanceData && attendanceData.length > 0 ? (
//                 attendanceData.map((attendance, index) => (
//                   <AttendanceTableRow
//                     key={index}
//                     attendance={attendance}
//                     index={index}
//                     onEdit={() => editAttendance(attendance._id)}
//                     onDelete={deleteAttendance}
//                     onActivate={activateAttendance}
//                   />
//                 ))
//               ) : (
//                 <p className='flex justify-center items-end text-xl w-full'>
//                   No Department Data Found
//                 </p>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </UserLayout>
//   );
// };

// export default Departments;


import React, { useState, useEffect, useCallback } from 'react';
// import Modal from '../Model/DepartmentModel';
import AttendanceTableRow from '../Table/PunchInModel';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserLayout from '../../../layout/UserLayout';

const fetchData = async (userId) => {
  try {
    const requestOptions = {
      method: 'GET',
      credentials: 'include',
    };

    const response = await fetch(
      `http://localhost:3000/api/v1/user/${userId}`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const userData = await response.json();

    const userCode = userData.data.user.userCode;

    // Check JWT cookie here to ensure it's for the current user (userId)

    // Simulate API call delay (you can replace this with your actual fetch call)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const attendanceResponse = await fetch(
      `http://localhost:3000/api/v1/attendance?userID=${userCode}`,
      requestOptions
    );

    if (!attendanceResponse.ok) {
      throw new Error('Failed to fetch attendance data');
    }
    const attendanceData = await attendanceResponse.json();

    return attendanceData.data.attendance || [];
  } catch (error) {
    throw new Error(error.message);
  }
};

const Loader = () => {
  return <div>Loading...</div>;
};

const PunchIn = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    const getUserIdFromLocalStorage = () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found in local storage');
      }
      return userId;
    };

    const fetchAttendanceData = async () => {
      try {
        const userId = getUserIdFromLocalStorage();
        const fetchedAttendanceData = await fetchData(userId);
        setAttendanceData(fetchedAttendanceData);
        // console.log(fetchedAttendanceData);
        setIsLoading(false); // Hide loader when data fetching is complete
      } catch (error) {
        setError(error.message);
        setIsLoading(false); // Hide loader in case of error
      }
    };

    fetchAttendanceData();
  }, []); // Empty dependency array to run once on component mount

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <UserLayout>
      
      <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
        <div className='max-w-full overflow-x-auto'>
          <table className='w-full table-auto'>
            <thead>
              <tr className='bg-gray-2 text-left dark:bg-meta-4'>
                <th className='min-w-[50px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11'>
                  S.No
                </th>
                <th className='min-w-[150px] py-4 px-4 font-medium text-black dark:text-white'>
                  userID
                </th>
                <th className='min-w-[150px] py-4 px-4 font-medium text-black dark:text-white'>
                  In Time
                </th>
                <th className='min-w-[150px] py-4 px-4 font-medium text-black dark:text-white'>
                  Out Time
                </th>
                <th className='min-w-[150px] py-4 px-4 font-medium text-black dark:text-white'>
                  Working Hours
                </th>
                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {attendanceData && attendanceData.length > 0 ? (
                attendanceData.map((attendance, index) => (
                  <AttendanceTableRow
                    key={index}
                    attendance={attendance}
                    index={index}
                    onEdit={() => editAttendance(attendance._id)}
                  />
                ))
              ) : (
                <p className='flex justify-center items-end text-xl w-full'>
                  No Data Found
                </p>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </UserLayout>
  );
};

export default PunchIn;

