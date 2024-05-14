import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import React from 'react';
import Modal from './userPersonalDetailsModel';

const PersonalDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [personalData, setPersonalData] = useState([]);
  const { userId } = useParams(); 

  const fetchPersonalData = async (userId) => {
    try {
      const requestOptions = {
        method: 'GET',
        credentials: 'include',
      };

      const userResponse = await fetch(
        `http://localhost:3000/api/v1/user/${userId}`,
        requestOptions
      );

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await userResponse.json();
      const userCode = userData.data.user.userCode || [];
      console.log(userData.data.user.userCode)

      const personalResponse = await fetch(
        `http://localhost:3000/api/v1/user/personal-details?code=${userCode}`,
        requestOptions
      );

      if (!personalResponse.ok) {
        throw new Error('Failed to fetch personal data');
      }
      const fetchedPersonalData = await personalResponse.json();

      return fetchedPersonalData.data.user || [];

    } catch (error) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const fetchedPersonalData = await fetchPersonalData(userId);
        setPersonalData(fetchedPersonalData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserDetails();
  }, [userId]); 

  const openAddUserModal = () => {
    setIsEdit(false);
    setShowModal(true);
  };

  const editUser = (id) => {
    setIsEdit(true);
    setShowModal(true);
   
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-14.5 xl:pb-1">
      <div>
        <button
          onClick={openAddUserModal}
          className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>
          {' '}
          Edit{' '}
        </button>
        {showModal && (
          <Modal
            onClose={() => setShowModal(false)}
            isEdit={isEdit}
            userId={userId}
            // userCode ={userCode}
            updateUserData={setPersonalData}
            
          />
        )}
      </div>
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">User Personal Details</h4>
      <div className="flex flex-col justify-around">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {personalData.map((official, index) => (
              <React.Fragment key={index}>
                {Object.entries(official).map(([key, value]) => (
                  <tr key={key} className="hover:bg-gray-3 dark:hover:bg-meta-4" onClick={() => editUser(value)} >
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
    </div>
  );
};

export default PersonalDetails;
