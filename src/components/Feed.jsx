import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, appendFeed, setLoading } from "../utils/feedSlice";
import FeedUserCard from "./FeeduserCard";
import { useAuth } from "@clerk/clerk-react";
import {
  testBackendConnection,
  testAuthenticatedEndpoint,
} from "../utils/api-test";
import {CircularProgress} from "@heroui/react";


const Feed = () => {
  const { getToken } = useAuth(); // get Clerk JWT
  const feedState = useSelector((store) => store.feed);
  const userProfile = useSelector((store) => store.user); // get user profile from Redux
  const dispatch = useDispatch();

  const getFeed = async (page = 1) => {
    try {
      dispatch(setLoading(true));
      const healthTest = await testBackendConnection();
      if (!healthTest.success) {
        console.error("❌ Backend health check failed:", healthTest.error);
        return;
      }
      const token = await getToken(); // fetch token from Clerk
      const authTest = await testAuthenticatedEndpoint(getToken);
      if (!authTest.success) {
        console.error("❌ Auth test failed:", authTest.error);
      }

      const res = await axios.get(BASE_URL + "/feed", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          limit: 10,
        },
        withCredentials: true,
      });

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
      console.error("❌ Full error object:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loadMoreUsers = async () => {
    if (feedState.hasMore && !feedState.isLoading) {
      await getFeed(feedState.currentPage + 1);
    }
  };

  useEffect(() => {
    if (userProfile && userProfile._id && feedState.users.length === 0) {
      getFeed();
    }
  }, [userProfile]);

  // Auto-load more users when running low
  useEffect(() => {
    if (
      feedState.users.length <= 2 &&
      feedState.hasMore &&
      !feedState.isLoading
    ) {
      loadMoreUsers();
    }
  }, [feedState.users.length, feedState.hasMore, feedState.isLoading]);

  // Simplified loading state - covers both profile and initial feed loading
  if (!userProfile || !userProfile._id || (feedState.isLoading && feedState.users.length === 0)) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)] px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center text-center">
          <CircularProgress aria-label="Loading feed..." size="lg" color="secondary"/>
          <p className="text-purple-700 font-medium mt-4">Loading feed...</p>
        </div>
      </div>
    );
  }

  if (feedState.users.length === 0 && !feedState.isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)] px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center text-center">
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

  return (
    <main className="w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-6xl flex flex-col items-center">
        {feedState.users.length > 0 && (
          <FeedUserCard user={feedState.users[0]} variant="feed" />
        )}
        {feedState.isLoading && feedState.users.length > 0 && (
          <div className="flex justify-center items-center mt-4">
            <div className="flex flex-col items-center justify-center text-center">
              <CircularProgress aria-label="Loading more..." size="md" color="secondary"/>
              <p className="text-purple-700 font-medium mt-2 text-sm">Loading more users...</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Feed;
