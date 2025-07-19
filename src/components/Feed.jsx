import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, appendFeed, setLoading } from "../utils/feedSlice";
import FeedUserCard from "./FeeduserCard";
import { useAuth } from "@clerk/clerk-react";

const Feed = () => {
  const { getToken } = useAuth(); // get Clerk JWT
  const feedState = useSelector((store) => store.feed);
  const userProfile = useSelector((store) => store.user); // get user profile from Redux
  const dispatch = useDispatch();

  const getFeed = async (page = 1) => {
    try {
      dispatch(setLoading(true));
      const token = await getToken(); // fetch token from Clerk
      console.log(`📡 Fetching feed page ${page}...`);
      const res = await axios.get(`${BASE_URL}/feed`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          limit: 10
        },
        withCredentials: true,
      });
      console.log("📋 Feed response:", res.data);
      console.log("👥 Number of users in feed:", res.data?.length || 0);
      
      if (page === 1) {
        dispatch(addFeed(res?.data || []));
      } else {
        dispatch(appendFeed(res?.data || []));
      }
    } catch (err) {
      console.error(
        "❌ Error fetching feed:",
        err?.response?.data || err.message
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

 
  useEffect(() => {
    if (userProfile && userProfile._id && feedState.users.length === 0) {
      getFeed();
    }
  }, [userProfile]);

  
  if (!userProfile || !userProfile._id)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );

  if (!feedState.users)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );

  if (feedState.users.length === 0 && !feedState.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">No users available in feed</p>
          <p className="text-sm text-gray-500">
            Either all users have been swiped or no other users exist
          </p>
          <button
            onClick={() => getFeed(1)}
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded"
          >
            Refresh Feed
          </button>
        </div>
      </div>
    );
  }

  if (feedState.isLoading && feedState.users.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading users...
      </div>
    );
  }

  return (
    <div>
      {feedState.users.length > 0 && (
        <FeedUserCard user={feedState.users[0]} variant="feed" />
      )}
      {feedState.isLoading && (
        <div className="text-center mt-4 text-white">
          Loading more users...
        </div>
      )}
    </div>
  );
};

export default Feed;