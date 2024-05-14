import { useState, useEffect } from 'react';
import React from 'react'
const LeaveCard1 = () => {
  const [leaveData, setLeaveData] = useState([]);

  const fetchLeaveData = async (userId) => {
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
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const leaveResponse = await fetch(
        `http://localhost:3000/api/v1/user/official-details?code=${userCode}`,
        requestOptions
      );

      if (!leaveResponse.ok) {
        throw new Error('Failed to fetch leave data');
      }
      const fetchedLeaveData = await leaveResponse.json();

      console.log(fetchedLeaveData);
      return fetchedLeaveData.data.user || [];
    } catch (error) {
      throw new Error(error.message);
    }
  };

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
        const fetchedLeaveData = await fetchLeaveData(userId);
        setLeaveData(fetchedLeaveData);
      } catch (error) {
        console.error('Error fetching leave data:', error);
      }
    };

    fetchAttendanceData();
  }, []); 

  return (
<div className="second">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Yearly Leaves
        </h4>
  
        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase ">
              Leaves
              </h5>
            </div>
            {/* <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase ">
              Department
              </h5>
            </div> */}
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase ">
              Number Of Leaves
              </h5>
            </div>
            
          </div>
  
          {leaveData.map((leave, index) => (
              <React.Fragment key={index}>
                <tr className="hover:bg-gray-3 dark:hover:bg-meta-4">
                  <td className="py-3 px-7 font-medium text-black dark:text-white">Sick Leave</td>
                  <td className="py-3 px-16">
                    <span className="text-sm">{leave.allowedSickLeave}</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-3 dark:hover:bg-meta-4">
                  <td className="py-3 px-7 font-medium text-black dark:text-white">Casual Leave</td>
                  <td className="py-3 px-12">
                    <span className="text-sm">{leave.allowedCasualLeave}</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-3 dark:hover:bg-meta-4">
                  <td className="py-3 px-7 font-medium text-black dark:text-white">Allowed LOP</td>
                  <td className="py-3 px-14">
                    <span className="text-sm">{leave.allowedLOP}</span>
                  </td>
                </tr>
              </React.Fragment>
            ))}
        </div>
      </div>
    
    </div>

);
};

export default LeaveCard1;
