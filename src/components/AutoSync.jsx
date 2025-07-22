import { useEffect, useState, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

const AutoSync = () => {
  const { getToken, isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();
  const dispatch = useDispatch();
  
  // Check Redux state to detect refresh scenarios
  const userFromRedux = useSelector(store => store.user);
  
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 12; // Increased for robustness
  const hasSucceededRef = useRef(false);

  // Reset retry count when user changes (new sign in)
  const prevUserIdRef = useRef(null);
  
  useEffect(() => {
    if (user?.id && user.id !== prevUserIdRef.current) {
      setRetryCount(0);
      hasSucceededRef.current = false;
      prevUserIdRef.current = user.id;
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id && !userFromRedux && hasSucceededRef.current) {
      hasSucceededRef.current = false;
      setRetryCount(0);
    }
  }, [user?.id, userFromRedux]);

  useEffect(() => {
    const syncUserWithBackend = async () => {
      if (hasSucceededRef.current) return;
      
      // Debug logging
      console.log("🔄 AutoSync Debug:", {
        isLoaded,
        isSignedIn,
        hasUser: !!user,
        userId: user?.id,
        retryCount,
        hasSucceeded: hasSucceededRef.current
      });
      
      // Wait for Clerk to be fully loaded and user to be signed in
      if (!isLoaded || !isSignedIn) {
        if (retryCount < maxRetries) {
          setTimeout(() => setRetryCount(prev => prev + 1), 1000);
        }
        return;
      }
      
      if (!user) {
        if (retryCount < maxRetries) {
          setTimeout(() => setRetryCount(prev => prev + 1), 1000);
        }
        return;
      }
      
      try {
      
        const token = await getToken();
        
        if (!token) {
          // Wait and retry if token is not ready
          if (retryCount < maxRetries) {
            setTimeout(() => setRetryCount(prev => prev + 1), 1000);
          }
          return;
        }
        if (retryCount === 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        const headers = { Authorization: `Bearer ${token}` };
        
        const response = await axios.get(`${BASE_URL}/profile/view`, {
          headers
        });
        if (response.data) {
          
          dispatch(addUser(response.data));
          hasSucceededRef.current = true;
        }
      } catch (error) {
        console.error("❌ AutoSync Error:", error?.response?.data || error.message);
        if (error.response) {
          console.error("❌ Error status:", error.response.status);
          console.error("❌ Error headers:", error.response.headers);
          console.error("❌ Error data:", error.response.data);
        }
        // If 404, try to auto-sync user
        if (error.response && error.response.status === 404) {
          try {
            const token = await getToken();
            
            await axios.post(`${BASE_URL}/auto-sync`, {}, {
              headers: { Authorization: `Bearer ${token}` },
            });
            
            setTimeout(() => setRetryCount(prev => prev + 1), 500);
            return;
          } catch (syncErr) {
            console.error("❌ Auto-sync failed:", syncErr?.response?.data || syncErr.message);
          }
        }
        // Retry on other errors
        if (retryCount < maxRetries && !hasSucceededRef.current) {
          setTimeout(() => setRetryCount(prev => prev + 1), 2000);
        }
      }
    };
    syncUserWithBackend();
  }, [isSignedIn, isLoaded, user, getToken, dispatch, retryCount]);

  return null;
};

export default AutoSync;