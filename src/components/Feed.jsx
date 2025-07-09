import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import FeedUserCard from "./FeeduserCard";
import { useAuth } from "@clerk/clerk-react";

const Feed = () => {
  const { getToken } = useAuth(); // get Clerk JWT
  const feed = useSelector((store) => store.feed);
  const userProfile = useSelector((store) => store.user); // get user profile from Redux
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed.length > 0) return;
    try {
      const token = await getToken(); // fetch token from Clerk
      console.log("📡 Fetching feed...");
      const res = await axios.get(BASE_URL + "/feed", {
        headers: {
          Authorization: `Bearer ${token}`,
        }, withCredentials: true,
      });
      console.log("📋 Feed response:", res.data);
      console.log("👥 Number of users in feed:", res.data?.length || 0);
      dispatch(addFeed(res?.data || []));
    } catch (err) {
      console.error(
        "❌ Error fetching feed:",
        err?.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    if (userProfile && userProfile._id) {
      getFeed();
    }
  }, [userProfile]);

  if (!userProfile || !userProfile._id)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );

  if (!feed)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );

  if (feed.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">No users available in feed</p>
          <p className="text-sm text-gray-500">
            Either all users have been swiped or no other users exist
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <FeedUserCard user={feed[0]} variant="feed" />
    </div>
  );
};

export default Feed;