import React, { useEffect, useState } from "react";
import EditProfile from "./EditProfile";
import { useAuth } from "@clerk/clerk-react";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import {CircularProgress} from "@heroui/react";

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
          }, withCredentials: true
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
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center justify-center">
          <CircularProgress aria-label="Loading profile..." size="lg" color="secondary"/>
          <p className="text-purple-700 font-medium mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center justify-center">
          <div className="text-red-500 mb-4 text-center">
            <p className="text-lg font-medium">Error loading profile</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!userFromRedux) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg text-gray-600">No profile data found</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <EditProfile user={userFromRedux} />
    </div>
  );
};

export default Profile;