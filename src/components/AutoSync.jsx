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
  const maxRetries = 5;
  const hasSucceededRef = useRef(false);

  // Reset retry count when user changes (new sign in)
  const prevUserIdRef = useRef(null);
  
  useEffect(() => {
    if (user?.id && user.id !== prevUserIdRef.current) {
      // Only reset if the user ID actually changed (different user signed in)
      console.log("🔄 AutoSync: Different user detected, resetting");
      setRetryCount(0);
      hasSucceededRef.current = false;
      prevUserIdRef.current = user.id;
    }
  }, [user?.id]);

  // Check if we need to reset success flag after refresh (Redux empty but user exists)
  useEffect(() => {
    if (user?.id && !userFromRedux && hasSucceededRef.current) {
      console.log("🔄 AutoSync: Refresh detected - Redux empty but user exists, resetting success flag");
      hasSucceededRef.current = false;
      setRetryCount(0);
    }
  }, [user?.id, userFromRedux]);

  useEffect(() => {
    const syncUserWithBackend = async () => {
      console.log("🔄 AutoSync: Running sync check");

      // Don't retry if already succeeded
      if (hasSucceededRef.current) {
        console.log("✅ AutoSync: Already succeeded, skipping");
        return;
      }

      // More flexible waiting conditions - don't give up too early
      if (!isLoaded) {
        if (retryCount < maxRetries) {
          setTimeout(() => setRetryCount(prev => prev + 1), 1000);
        }
        return;
      }

      if (!isSignedIn) {
        return; // Don't retry if not signed in
      }

      if (!user) {
        // Keep retrying for user object even if Clerk says it's loaded
        if (retryCount < maxRetries) {
          setTimeout(() => setRetryCount(prev => prev + 1), 1000);
        }
        return;
      }

      try {
        console.log("🔄 AutoSync: Fetching latest profile data...");
        const token = await getToken();

        // ✅ FIX: Fetch existing profile data instead of sending stale Clerk data
        const response = await axios.get(`${BASE_URL}/profile/view`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Store user data in Redux
        if (response.data) {
          console.log("✅ AutoSync: Successfully loaded profile data");
          dispatch(addUser(response.data));
          hasSucceededRef.current = true;
        }
      } catch (error) {
        console.error("❌ Auto-sync failed:", error);

        // Retry on failure if retries available
        if (retryCount < maxRetries && !hasSucceededRef.current) {
          setTimeout(() => setRetryCount(prev => prev + 1), 2000);
        }
      }
    };

    syncUserWithBackend();
  }, [isSignedIn, isLoaded, user, getToken, dispatch, retryCount]);

  // This component doesn't render anything
  return null;
};

export default AutoSync;