import React from 'react';
import EditProfile from './EditProfile';
import { useUser } from '@clerk/clerk-react';

const Profile = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div>
      <EditProfile user={user} />
    </div>
  );
};

export default Profile;
