import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ChatCard = () => {
  const [holidayData, setHolidayData] = useState([]);

  useEffect(() => {
    const fetchHolidayData = async () => {
      try {
        const requestOptions = {
          method: 'GET',
          credentials: 'include',
        };
        const response = await fetch(`http://localhost:3000/api/v1/admin/holiday?status=1`, requestOptions);

        if (!response.ok) {
          throw new Error('Failed to fetch holiday data');
        }
        const holidayData = await response.json();

        setHolidayData(holidayData.data.holiday);
      } catch (error) {
        console.error('Error fetching holiday data:', error);
      }
    };

    fetchHolidayData();
  }, []);

  return (
 
    <div className="w-full rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-14.5 xl:pb-1">
    {/* // <div className='rounded-sm border border-stroke bg-white px-5 pt-4 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 flex justify-between'> */}
    <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
    Holiday
    </h4>

    <div className="flex flex-col">
      <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3">
        <div className="p-2.5 xl:p-5">
          <h5 className="text-sm font-medium uppercase ">
            Holiday Name
          </h5>
        </div>
       
        
        <div className="p-2.5 text-center xl:p-5">
          <h5 className="text-sm font-medium uppercase ">
          Date
          </h5>
        </div>
       
        
      </div>
  
        {holidayData.map((holiday, index) => (
          <tr className="hover:bg-gray-3 dark:hover:bg-meta-4" key={index}>
            <td className="py-3 px-6.5">{holiday.holidayName}</td>
            <td className="py-3 px-24">{new Date(holiday.holidayDate).toDateString()}</td>
          </tr>
        ))}
    
  </div>
</div>

  );
};

export default ChatCard;
