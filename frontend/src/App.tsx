import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUpUser';
import Forgot from './pages/Authentication/Forgot';
// import Department from './pages/Calender';
import Department from './pages/Setup/Departments';
import Designation from './pages/Setup/Designation';
import Holiday from './pages/Setup/Holidays';
import HolidayUser from './pages/user/Pages/Holidays';
import LeaveType from './pages/Setup/LeaveType';
import ShiftTimings from './pages/Setup/ShiftTiming';
import PunchReport from './pages/Report/PunchReport';
import ForgotPunch from './pages/Report/ForgotPunch';
import LeavesRequest from './pages/Leaves/LeavesRequest';
import LeavesReport from './pages/Leaves/LeavesReport';
import Chart from './pages/Chart';
import Company from './pages/Dashboard/Company';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import User from './pages/Employee/User';
import Role from './pages/Setup/Role';
import UserLeave from './pages/user/Pages/UserLeave';
import UserAdmin from './pages/user/UserAdmin';
import LeaveDetails from './pages/user/Pages/LeaveDetails';
import Personal from './pages/user/Pages/Personal';
import PunchIn from './pages/user/Pages/PunchIn';
import AttendanceRequest from './pages/user/Pages/AttendanceRequest';
import Reset from './pages/Authentication/ResetPassword';
import UserAllDetails from './pages/Employee/UserAllDetails';

import UserPersonalDetails from './pages/Employee/UserPersonalDetails'

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title='Company Dashboard | ISM-HRM' />
              <Company />
            </>
          }
        />
        <Route
          path='/setup/departments'
          element={
            <>
              <PageTitle title='Department | ISM - HRMS' />
              <Department />
            </>
          }
        />
        <Route
          path='/setup/designation'
          element={
            <>
              <PageTitle title='Department | ISM - HRMS' />
              <Designation />
            </>
          }
        />
        <Route
          path='/setup/holidays'
          element={
            <>
              <PageTitle title='Department | ISM - HRMS' />
              <Holiday />
            </>
          }
        />
        <Route
          path='/setup/leaveType'
          element={
            <>
              <PageTitle title='Department | ISM - HRMS' />
              <LeaveType />
            </>
          }
        />
        <Route
          path='/setup/shiftTiming'
          element={
            <>
              <PageTitle title='Department | ISM - HRMS' />
              <ShiftTimings />
            </>
          }
        />
        <Route
          path='/setup/role'
          element={
            <>
              <PageTitle title='Role | ISM - HRMS' />
              <Role />
            </>
          }
        />
        <Route
          path='/employee/user'
          element={
            <>
              <PageTitle title='Department | ISM - HRMS' />
              <User />
            </>
          }
        />
        <Route
          path='/attendence/report/punchReport'
          element={
            <>
              <PageTitle title='Department | ISM - HRMS' />
              <PunchReport />
            </>
          }
        />
        <Route
          path='/attendence/report/forgotPunch'
          element={
            <>
              <PageTitle title='Department | ISM - HRMS' />
              <ForgotPunch />
            </>
          }
        />
        <Route
          path='/leaves/leavesRequest'
          element={
            <>
              <PageTitle title='Department | ISM - HRMS' />
              <LeavesRequest />
            </>
          }
        />
        <Route
          path='/leaves/leavesReport'
          element={
            <>
              <PageTitle title='Department | ISM - HRMS' />
              <LeavesReport />
            </>
          }
        />
        <Route
          path='/profile'
          element={
            <>
              <PageTitle title='Profile | ISM - HRMS' />
              <Profile />
            </>
          }
        />
        <Route
          path='/forms/form-elements'
          element={
            <>
              <PageTitle title='Form Elements | ISM - HRMS' />
              <FormElements />
            </>
          }
        />
        <Route
          path='/forms/form-layout'
          element={
            <>
              <PageTitle title='Form Layout | ISM - HRMS' />
              <FormLayout />
            </>
          }
        />
        <Route
          path='/tables'
          element={
            <>
              <PageTitle title='Tables | ISM - HRMS' />
              <Tables />
            </>
          }
        />
        {/* <Route
          path='/employee/user/userOfficialDetails/:userId'
          element={
            <>
              <PageTitle title='Tables | ISM - HRMS' />
              <UserPersonalDetails />
            </>
          }
        /> */}
        <Route
          path='/employee/user/settings'
          element={
            <>
              <PageTitle title='Settings | ISM - HRMS' />
              <Settings />
            </>
          }
        />
        <Route
          path='/employee/user/userDetails/:userId'
          element={
            <>
              <PageTitle title='Settings | ISM - HRMS' />
              <UserAllDetails />
            </>
          }
        />
        <Route
          path='/chart'
          element={
            <>
              <PageTitle title='Basic Chart | ISM - HRMS' />
              <Chart />
            </>
          }
        />
        <Route
          path='/ui/alerts'
          element={
            <>
              <PageTitle title='Alerts | ISM - HRMS' />
              <Alerts />
            </>
          }
        />
        <Route
          path='/ui/buttons'
          element={
            <>
              <PageTitle title='Buttons | ISM - HRMS' />
              <Buttons />
            </>
          }
        />
        <Route
          path='/auth/signUp'
          element={
            <>
              <PageTitle title='Signin | ISM - HRMS' />
              <SignUp />
            </>
          }
        />
        <Route
          path='/auth/reset-password'
          element={
            <>
              <PageTitle title='Signin | ISM - HRMS' />
              <Reset />
            </>
          }
        />
        <Route
          path='/auth/forgot'
          element={
            <>
              <PageTitle title='Signup | ISM - HRMS' />
              <Forgot />
            </>
          }
        />
        <Route
          path='/auth/signIn'
          element={
            <>
              <PageTitle title='Signup | ISM - HRMS' />
              <SignIn />
            </>
          }
        />
        <Route
          path='/user'
          element={
            <>
              <PageTitle title='Signup | ISM - HRMS' />
              <UserAdmin />
            </>
          }
        />
        <Route
          path='/user/leaves/leavesRequest'
          element={
            <>
              <PageTitle title='Leave | ISM - HRMS' />
              <UserLeave />
            </>
          }
        />
        <Route
          path='/user/leaves/details'
          element={
            <>
              <PageTitle title='Leave | ISM - HRMS' />
              <LeaveDetails />
            </>
          }
        />
        <Route
          path='/user/holidays'
          element={
            <>
              <PageTitle title='Holidays | ISM - HRMS' />
              <HolidayUser />
            </>
          }
        />

        <Route
          path='/user/profile/personalDetails'
          element={
            <>
              <PageTitle title='Holidays | ISM - HRMS' />
              <Personal />
            </>
          }
        />

        <Route
          path='/user/attendance/punchInDetails'
          element={
            <>
              <PageTitle title='Holidays | ISM - HRMS' />
              <PunchIn />
            </>
          }
        />
        <Route
          path='/user/attendance/request'
          element={
            <>
              <PageTitle title='Holidays | ISM - HRMS' />
              <AttendanceRequest />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
