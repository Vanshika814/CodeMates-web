import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../utils/feedSlice';
import UserCard from './userCard'

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  
  const dispatch = useDispatch();

  const getFeed = async () =>{
    if (feed.length > 0) return;
      try {
        const res = await axios.get(BASE_URL + "/feed", {
          withCredentials: true
        });
        dispatch(addFeed(res?.data || []));
      } catch(err){
        console.error("Error fetching feed:", err.message);
      }
  };

  useEffect(() => {
    getFeed();
  },[]);

  if(!feed) return;

  // if(feed.length)
  return (
    <div>
      {feed.length > 0 ? (
        <UserCard user={feed[0]} />
      ) : (
        <p>Loading feed or no users available</p>
      )}
    </div>
  );
};

export default Feed;
