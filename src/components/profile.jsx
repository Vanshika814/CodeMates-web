import React, { useEffect, useState } from "react";
import EditProfile from "./EditProfile";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Profile = () => {
  const { getToken, isLoaded } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isLoaded) return;

      try {
        setLoading(true);
        const token = await getToken();

        const response = await axios.get(BASE_URL + "/profile/view", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError(err?.response?.data || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isLoaded, getToken]);

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

  if (!user) {
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
      <EditProfile user={user} />
    </div>
  );
};

export default Profile;