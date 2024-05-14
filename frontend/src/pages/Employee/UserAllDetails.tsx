
import DefaultLayout from '../../layout/DefaultLayout';
import UserPersonalDetails from './UserPersonalDetails';
import UserOfficialDetails from './UserOfficialDetails';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const UserAllDetails = () => {
  return (
    <DefaultLayout>
        <Breadcrumb pageName='User Details' />
        <div className='flex justify-around'>
            <UserPersonalDetails />
            <UserOfficialDetails />
        </div>
    </DefaultLayout>
  )
}

export default UserAllDetails