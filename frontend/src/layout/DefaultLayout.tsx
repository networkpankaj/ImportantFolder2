import React, { useState, ReactNode, useEffect } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState();

  const fetchData = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const requestOptions = {
        method: 'GET',
        credentials: 'include', // Include cookies in cross-origin requests
      };
      const response = await fetch(
        `http://localhost:3000/api/v1/user/${userId}`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const jsonData = await response.json();
      const users = jsonData.data.user || [];
      if (!user) {
        return null; // Render nothing if user is not defined
      }

      // Fetch department and designation details for each user concurrently
      // const updatedUsers = await Promise.all(
      //   users.map(async (user) => {
      //     try {
      //       const [departmentResponse, designationResponse] = await Promise.all(
      //         [
      //           fetch(
      //             `http://localhost:3000/api/v1/admin/department/${user.userDepartment}`
      //           ),
      //           fetch(
      //             `http://localhost:3000/api/v1/admin/designation/${user.userDesignation}`
      //           ),
      //         ]
      //       );

      //       if (!departmentResponse.ok) {
      //         throw new Error('Failed to fetch department data.');
      //       }
      //       if (!designationResponse.ok) {
      //         throw new Error('Failed to fetch designation data.');
      //       }

      //       const departmentData = await departmentResponse.json();
      //       const designationData = await designationResponse.json();
      //       // console.log(designationData);

      //       return {
      //         ...user,
      //         departmentName:
      //           departmentData.data.department.departmentName || 'Unknown',
      //         designationName:
      //           designationData.data.designation.designationName || 'Unknown',
      //       };
      //     } catch (error) {
      //       console.error(`Error fetching data for user ${user._id}:`, error);
      //       // Return the user with placeholder names
      //       return {
      //         ...user,
      //         departmentName: 'Unknown',
      //         designationName: 'Unknown',
      //       };
      //     }
      //   })
      // );

      setUser(users);
      console.log(users);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='dark:bg-boxdark-2 dark:text-bodydark'>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className='flex h-screen overflow-hidden'>
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
          {/* <!-- ===== Header Start ===== --> */}
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className='mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10'>
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default DefaultLayout;
