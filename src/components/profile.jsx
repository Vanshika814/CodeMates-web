import React, { useEffect, useState } from "react";
import EditProfile from "./EditProfile";
import { useAuth } from "@clerk/clerk-react";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Profile = () => {
  const { getToken, isLoaded } = useAuth();
  const dispatch = useDispatch();
  
  // Get user from Redux store first
  const userFromRedux = useSelector(store => store.user);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isLoaded) return;

      // If user already exists in Redux, use that data (AutoSync should have loaded it)
      if (userFromRedux && userFromRedux._id) {
        setLoading(false);
        return;
      }

      // Fallback: fetch profile if AutoSync failed or data missing
      try {
        console.log("📋 Profile: AutoSync data not available, fetching profile...");
        setLoading(true);
        const token = await getToken();

        const response = await axios.get(BASE_URL + "/profile/view", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Store user data in Redux for future use
        dispatch(addUser(response.data));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError(err?.response?.data || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isLoaded, getToken, userFromRedux, dispatch]);

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p>Error loading profile: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!userFromRedux) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p>No profile data found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <EditProfile user={userFromRedux} />
    </div>
  );
};

export default Profile;