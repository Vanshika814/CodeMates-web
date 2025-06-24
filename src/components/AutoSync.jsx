import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';

const AutoSync = () => {
  const { getToken, isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    const syncUserWithBackend = async () => {
      if (!isSignedIn || !isLoaded || !user) return;

      try {
        console.log('🔄 Starting auto-sync with backend...');
        const token = await getToken();

        // Prepare user data from Clerk
        const userData = {
          clerkId: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName || user.fullName?.split(' ')[0] || '',
          lastName: user.lastName || user.fullName?.split(' ').slice(1).join(' ') || '',
          imageUrl: user.imageUrl,
          username: user.username,
          createdAt: user.createdAt,
        };

        console.log('📤 Sending user data to backend:', userData);

        // Call backend auto-sync endpoint
        const response = await axios.post(
          `${BASE_URL}/auto-sync`,
          userData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('✅ Auto-sync successful:', response.data);
        
        // Store user data in Redux
        if (response.data && response.data.data) {
          dispatch(addUser(response.data.data));
        }

      } catch (error) {
        console.error('❌ Auto-sync failed:', error);
        
        // If auto-sync fails, still try to set basic user info
        if (user) {
          const basicUserInfo = {
            id: user.id,
            firstName: user.firstName || user.fullName?.split(' ')[0] || '',
            lastName: user.lastName || user.fullName?.split(' ').slice(1).join(' ') || '',
            email: user.emailAddresses[0]?.emailAddress,
            imageUrl: user.imageUrl,
          };
          dispatch(addUser(basicUserInfo));
        }
      }
    };

    syncUserWithBackend();
  }, [isSignedIn, isLoaded, user, getToken, dispatch]);

  // This component doesn't render anything
  return null;
};

export default AutoSync; 