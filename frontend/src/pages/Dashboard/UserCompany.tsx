

import React, { useState, useEffect } from 'react';
import CardDataStats from '../../components/CardDataStats';
import ChatCard from '../../components/Chat/ChatCard.tsx';
import UserLayout from '../../layout/UserLayout';
import TableData from '../../components/Tables/TableData';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Company: React.FC = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isClockInButtonDisabled, setIsClockInButtonDisabled] = useState(false);
  const [isClockOutButtonRed, setIsClockOutButtonRed] = useState(false);
  const [isClockOutButtonDisabled, setIsClockOutButtonDisabled] = useState(true);
  const [attendanceId, setAttendanceId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [totalElapsedTime, setTotalElapsedTime] = useState('00:00:00');
  const [totalDurationMs, setTotalDurationMs] = useState(0);

  useEffect(() => {
    const fetchClockStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/attendance?userID=ISM10002&isClockedIn=1`
        );
        if (response.ok) {
          const jsonData = await response.json();
          if (jsonData.data.attendance[0].isClockedIn === 1) {
            setIsClockedIn(true);
            setStartTime(new Date());
            setAttendanceId(jsonData.data.attendance[0]._id);
            const clockData = {
              isClockedIn: true,
              attendanceId: jsonData.data.attendance[0]._id,
              startTime: new Date(),
              endTime: null,
              elapsedTime: '00:00:00',
            };
            localStorage.setItem('clockData', JSON.stringify(clockData));
            setIsClockOutButtonRed(true);
            setIsClockInButtonDisabled(true);
            setIsClockOutButtonDisabled(false);
          }
        }
      } catch (error) {
        setIsClockedIn(false);
        toast.error('Failed to fetch clock status: ' + error.message);
      }
    };
  
    fetchClockStatus();
  }, []);

  useEffect(() => {
    const storedClockData = localStorage.getItem('clockData');
    if (storedClockData) {
      const { isClockedIn, attendanceId, startTime, endTime, elapsedTime } =
        JSON.parse(storedClockData);
      setIsClockedIn(isClockedIn);
      setAttendanceId(attendanceId);
      setStartTime(new Date(startTime));
      setEndTime(new Date(endTime));
      setElapsedTime(elapsedTime);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isClockedIn && startTime) {
      timer = setInterval(() => {
        const now = new Date();
        const diffMs = now - startTime;
        const diffSec = Math.floor(diffMs / 1000); 
        const diffMins = Math.floor(diffSec / 60); 
        const diffHrs = Math.floor(diffMins / 60); 
        const diffDays = Math.floor(diffHrs / 24); 

        const hrs = diffHrs % 24;
        const mins = diffMins % 60;
        const secs = diffSec % 60;

        const formattedTime = `${hrs.toString().padStart(2, '0')}:${mins
          .toString()
          .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        setElapsedTime(formattedTime);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isClockedIn, startTime]);

  useEffect(() => {
    if (!isClockedIn) {
      setEndTime(new Date());
      setElapsedTime('00:00:00');
      localStorage.removeItem('clockData');
    }
  }, [isClockedIn]);

  useEffect(() => {
    if (endTime && startTime) {
      const diffMs = endTime - startTime;
      setTotalDurationMs(totalDurationMs + diffMs);
      const durationSec = Math.floor(totalDurationMs / 1000);
      const durationMins = Math.floor(durationSec / 60);
      const durationHrs = Math.floor(durationMins / 60);

      const hrs = durationHrs % 24;
      const mins = durationMins % 60;
      const secs = durationSec % 60;

      const formattedTime = `${hrs.toString().padStart(2, '0')}:${mins
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

      setTotalElapsedTime(formattedTime);
    }
  }, [endTime]);

  const handleClockIn = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: 'ISM10002', isClockedIn: 1 }),
      });
  
      if (response.ok) {
        const jsonData = await response.json();
        setIsClockedIn(true);
        setIsClockOutButtonRed(true);
        setIsClockInButtonDisabled(true);
        setIsClockOutButtonDisabled(false);
        setStartTime(new Date());
        setAttendanceId(jsonData.data.attendance._id);
        const clockData = {
          isClockedIn: true,
          attendanceId: jsonData.data.attendance._id,
          startTime: new Date(),
          endTime: null,
          elapsedTime: '00:00:00',
        };
        localStorage.setItem('clockData', JSON.stringify(clockData));
        toast.success('Clock in successful');
      } else {
        throw new Error('Failed to clock in.');
      }
    } catch (error) {
      console.error('Clock operation failed:', error);
      toast.error('Clock operation failed: ' + error.message);
    }
  };

  const handleClockOut = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/attendance/${attendanceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isClockedIn: 0 }),
      });
  
      if (response.ok) {
        const clockOutTime = new Date();
        const durationMs = clockOutTime - startTime;
  
        // Calculate elapsed time for this session
        const diffSec = Math.floor(durationMs / 1000);
        const diffMins = Math.floor(diffSec / 60);
        const diffHrs = Math.floor(diffMins / 60);
  
        const hrs = diffHrs % 24;
        const mins = diffMins % 60;
        const secs = diffSec % 60;
  
        const formattedTime = `${hrs.toString().padStart(2, '0')}:${mins
          .toString()
          .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  
        // Update total elapsed time with the current elapsed time
        setTotalElapsedTime(formattedTime);
  
        toast.success('Clock out successful');
      } else {
        throw new Error('Failed to clock out.');
      }
    } catch (error) {
      console.error('Clock operation failed:', error);
      toast.error('Clock operation failed: ' + error.message);
    }
  };
  
  
  
  
  
  
  return (
    <UserLayout>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 flexitems-center'>
      
        <CardDataStats title='Clock In'>
          <div className='flex gap-2'>
            <button
              className='hover:text-primary'
              disabled={isClockInButtonDisabled}
              onClick={handleClockIn}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='32'
                height='32'
                viewBox='0 0 24 24'
                fill='none'
                stroke='green'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-alarm-clock'>
                <circle cx='12' cy='13' r='8' />
                <path d='M12 9v4l2 2' />
                <path d='M5 3 2 6' />
                <path d='m22 6-3-3' />
                <path d='M6.38 18.7 4 21' />
                <path d='M17.64 18.67 20 21' />
              </svg>
            </button>
          </div>
        </CardDataStats>

        <CardDataStats title='Clock Out'>
          <div className='flex gap-2'>
            <button
              className='hover:text-primary'
              disabled={!isClockedIn || isClockOutButtonDisabled}
              onClick={handleClockOut}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='32'
                height='32'
                viewBox='0 0 24 24'
                fill='none'
                stroke={isClockOutButtonRed ? 'red' : 'green'}
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-alarm-clock-off'>
                <path d='M6.87 6.87a8 8 0 1 0 11.26 11.26' />
                <path d='M19.9 14.25a8 8 0 0 0-9.15-9.15' />
                <path d='m22 6-3-3' />
                <path d='M6.26 18.67 4 21' />
                <path d='m2 2 20 20' />
                <path d='M4 4 2 6' />
              </svg>
            </button>
          </div>
        </CardDataStats>

        <CardDataStats title='Elapsed Time'>
          <p>{elapsedTime}</p>
        </CardDataStats>

        <CardDataStats title='Total Elapsed Time'>
          <p>{totalElapsedTime}</p>
        </CardDataStats>
        
      </div>

      <div className='mt-4 grid grid-cols-12 gap-6 md:mt-6 md:gap-7 2xl:mt-7.5 2xl:gap-7.5'>
        <div className='col-span-12 xl:col-span-8'>
          <TableData />
        </div>
        <ChatCard />
      </div>
    </UserLayout>
  );
};

export default Company;

