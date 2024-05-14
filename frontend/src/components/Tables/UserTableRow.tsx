import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserTableRow = ({ user, index, onEdit, onDelete, onActivate }) => {
  
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [attendanceId, setAttendanceId] = useState(null);

  useEffect(() => {
    const fetchClockStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/attendance?userID=${user.userCode}&isClockedIn=1`
        );
        if (response.ok) {
          const jsonData = await response.json();
          if (
            jsonData.data.attendance.length > 0 &&
            jsonData.data.attendance[0].isClockedIn === 1
          ) {
            setIsClockedIn(true);
            setAttendanceId(jsonData.data.attendance[0]._id);
            toast('User is already clocked in.');
          } else {
            setIsClockedIn(false);
            setAttendanceId(null);
          }
        } else {
          setIsClockedIn(false);
          setAttendanceId(null);
          console.log('Failed to fetch clock status:', response.statusText);
        }
      } catch (error) {
        setIsClockedIn(false);
        setAttendanceId(null);
        console.error('Failed to fetch clock status:', error);
        toast.error('Failed to fetch clock status.');
      }
    };

    fetchClockStatus();
  }, [user.userCode]);

  const handleEdit = () => {
    onEdit(user._id);
  };

  const handleDelete = () => {
    onDelete(user._id);
  };

  const handleActivate = () => {
    onActivate(user._id);
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Clock in
  const handleClockIn = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: user.userCode }),
      });
      if (!response.ok) {
        throw new Error('Failed to clock in.');
      }
      const jsonData = await response.json();
      setIsClockedIn(true);
      setAttendanceId(jsonData.data.attendance._id);
      // Store clock data in localStorage with a unique key for each user
      const clockData = {
        isClockedIn: true,
        attendanceId: jsonData.data.attendance._id,
        startTime: new Date(),
        endTime: null,
      };
      localStorage.setItem(
        `clockData_${user.userCode}`,
        JSON.stringify(clockData)
      );
      toast('User clocked in successfully.');
    } catch (error) {
      console.error('Failed to clock in:', error);
      toast.error('Failed to clock in.');
    }
  };

  // Clock out
  const handleClockOut = async () => {
    try {
      await fetch(`http://localhost:3000/api/v1/attendance/${attendanceId}`, {
        method: 'PATCH',
      });
      setIsClockedIn(false);
      setAttendanceId(null);
      // Remove clock data from localStorage
      localStorage.removeItem(`clockData_${user.userCode}`);
      toast('User clocked out successfully.');
    } catch (error) {
      console.error('Failed to clock out:', error);
      toast.error('Failed to clock out.');
    }
  };

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `settings`;
    navigate(path);
  };
 
  const handleUser = (userId) => {
    console.log("Edit user with ID:", userId)
    console.log("userId:", userId);
    let path = `/employee/user/userDetails/${userId}`;
    navigate(path);
  }
  
  return (
    <tr key={index + 1}>
      <td className='border-b border-[#eee] py-5 px-4 pl-5 dark:border-strokedark xl:pl-11'>
        <h5 className='font-medium text-black dark:text-white'>{index + 1}</h5>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p className='text-black dark:text-white'>{user.userCode}</p>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p className='text-black dark:text-white'>
          {capitalizeFirstLetter(user.userName)}
        </p>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p className='text-black dark:text-white'>{user.userEmail}</p>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p className='text-black dark:text-white'>{user.userPhoneNumber}</p>
      </td>
      {/* <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p className='text-black dark:text-white'>{user.departmentName}</p>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p className='text-black dark:text-white'>{user.designationName}</p>
      </td> */}
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <p
          className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
            user.status === 1
              ? 'bg-success text-success'
              : user.status === 0
              ? 'bg-danger text-danger'
              : 'bg-warning text-warning'
          }`}>
          {user.status === 1 ? 'Active' : 'InActive'}
        </p>
      </td>
      <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
        <div className='flex items-center space-x-3.5'>
        <button
            className='hover:text-primary'
            id={user._id}
            onClick={() => handleUser(user._id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </button>
          <button
            className='hover:text-primary'
            id={user._id}
            onClick={routeChange}>
            <svg
              className='fill-current'
              width='18'
              height='18'
              viewBox='0 0 18 18'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z'
                fill=''
              />
              <path
                d='M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z'
                fill=''
              />
            </svg>
          </button>
          {user.status === 1 ? (
            <button
              className='hover:text-danger'
              id={user._id}
              onClick={handleDelete}>
              <svg
                className='fill-current'
                width='18'
                height='18'
                viewBox='0 0 18 18'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z'
                  fill=''
                />
                <path
                  d='M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z'
                  fill=''
                />
                <path
                  d='M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z'
                  fill=''
                />
                <path
                  d='M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z'
                  fill=''
                />
              </svg>
            </button>
          ) : (
            <button
              className='hover:text-success'
              id={user._id}
              onClick={handleActivate}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
                class='lucide lucide-list-restart'>
                <path d='M21 6H3' />
                <path d='M7 12H3' />
                <path d='M7 18H3' />
                <path d='M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14' />
                <path d='M11 10v4h4' />
              </svg>
            </button>
          )}
          <button
            className={`hover:text-primary ${isClockedIn ? 'text-danger' : ''}`}
            onClick={isClockedIn ? handleClockOut : handleClockIn}>
            {isClockedIn ? (
              <button>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  class='lucide lucide-alarm-clock-off'>
                  <path d='M6.87 6.87a8 8 0 1 0 11.26 11.26' />
                  <path d='M19.9 14.25a8 8 0 0 0-9.15-9.15' />
                  <path d='m22 6-3-3' />
                  <path d='M6.26 18.67 4 21' />
                  <path d='m2 2 20 20' />
                  <path d='M4 4 2 6' />
                </svg>
              </button>
            ) : (
              <button>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  class='lucide lucide-alarm-clock'>
                  <circle
                    cx='12'
                    cy='13'
                    r='8'
                  />
                  <path d='M12 9v4l2 2' />
                  <path d='M5 3 2 6' />
                  <path d='m22 6-3-3' />
                  <path d='M6.38 18.7 4 21' />
                  <path d='M17.64 18.67 20 21' />
                </svg>
              </button>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;
