import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const OfficialDetails = () => {

  const [officialData, setOfficialData] = useState([]);
  const { userId } = useParams(); 

  const fetchOfficialData = async (userId) => {
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
      const userCode = userData.data.user.userCode || [];
      console.log(userData.data.user.userCode)
    

      const officialResponse = await fetch(
        `http://localhost:3000/api/v1/user/official-details?code=${userCode}`,
        requestOptions
      );

      if (!officialResponse.ok) {
        throw new Error('Failed to fetch official data');
      }
      const fetchedOfficialData = await officialResponse.json();

      console.log(fetchedOfficialData);
      return fetchedOfficialData.data.user || [];

    } catch (error) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const fetchedOfficialData = await fetchOfficialData(userId);
        setOfficialData(fetchedOfficialData);
      }catch(error) {
        console.error('Error fetching user data:', error);
      }
     
    };
    fetchUserDetails();
  }, [userId]);

  
  return (
    
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-14.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">User Official Details</h4>
      <div className="flex flex-col justify-around">
  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
      {officialData.map((official, index) => (
        <React.Fragment key={index}>
          {Object.entries(official).map(([key, value]) => (
            <tr key={key} className="hover:bg-gray-3 dark:hover:bg-meta-4">
              <td className="py-3 px-7 font-medium text-black dark:text-white">{key}</td>
              <td className="py-3 px-12">
                <span className="text-sm">{value}</span>
              </td>
            </tr>
          ))}
        </React.Fragment>
      ))}
    </tbody>
  </table>
</div>

      {/* <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3">
          <div className="p-3.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase">Keys</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase">Values</h5>
          </div>
        </div>

        {officialData.map((official, index) => (
          <React.Fragment key={index}>
            {Object.entries(official).map(([key, value]) => (
              <tr key={key} className="hover:bg-gray-3 dark:hover:bg-meta-4">
                <td className="py-3 px-7 font-medium text-black dark:text-white">{key}</td>
                <td className="py-3 px-12">
                  <span className="text-sm">{value}</span>
                </td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </div> */}
    </div>
  );
};

export default OfficialDetails;
