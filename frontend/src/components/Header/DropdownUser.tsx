import { useEffect, useRef, useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import UserOne from '../../images/user/user-01.png';


const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [designation, setDesignation] = useState(null); // State to store user's designation
  const trigger = useRef(null);
  const dropdown = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const requestOptions = {
          method: 'GET',
          credentials: 'include', // Include cookies in cross-origin requests
        };
        const response = await fetch(
          `http://localhost:3000/api/v1/user/${userId}`,
          requestOptions
        );

        if (response.ok) {
          const jsonData = await response.json();
          setUserData(jsonData.data.user);
          console.log(jsonData.data.user)

          // Fetch designation using user's designation ID
          const designationResponse = await fetch(
            `http://localhost:3000/api/v1/admin/designation/${jsonData.data.user.userDesignation}`,
            requestOptions
          );

          if (designationResponse.ok) {
            const designationData = await designationResponse.json();
            setDesignation(designationData.data.designation.designationName);
          } else {
            throw new Error('Failed to fetch designation data');
          }
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {

      fetchUserData(storedUserId);
    }
    console.log(storedUserId)
  }, []);

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [dropdownOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [dropdownOpen]);

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleLogout = async () => {
    try {
      const requestOptions = {
        method: 'GET',
        credentials: 'include',
      };
      const response = await fetch(
        'http://localhost:3000/api/v1/user/logout',
        requestOptions
      );
      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      const result = await response.json();
      console.log(result);
      if (result.status === 'success') {
        navigate('/auth/signIn');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div className='relative'>
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className='flex items-center gap-4'
        to='#'>
        <span className='hidden text-right lg:block'>
          <span className='block text-sm font-medium text-black dark:text-white'>
            {userData ? capitalizeFirstLetter(userData.userName) : 'Loading...'}
          </span>
          <span className='block text-xs'>{designation ? capitalizeFirstLetter(designation) : 'Loading...'}</span> {/* Display user's designation */}
        </span>

        <span className='h-12 w-12 rounded-full'>
          <img src={UserOne} alt='User' />
        </span>
      </Link>

      {/* Dropdown Start */}
      <div
        ref={dropdown}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen ? 'block' : 'hidden'
        }`}>
        <ul className='flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark'>
          <li>
            <Link to='/profile' className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base'>
              My Profile
            </Link>
          </li>
          <li>
            <Link to='/pages/settings' className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base'>
              Account Settings
            </Link>
          </li>
        </ul>
        <button className='flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base ' onClick={handleLogout}>
          Log Out
        </button>
      </div>
      {/* Dropdown End */}
    </div>
  );
};

export default DropdownUser;
