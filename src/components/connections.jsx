import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { addConnection } from '../utils/connectionSlice';
import { useAuth } from '@clerk/clerk-react';
import { Link } from "react-router"; // ✅ corrected import
import {CircularProgress} from "@heroui/react";

const Connections = () => {
  const { getToken } = useAuth();
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();
 const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    try {
       setLoading(true);
      const token = await getToken();

      const res = await axios.get(BASE_URL + "/user/connections", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(addConnection(res.data.data));
    } catch (err) {
      console.error("Error fetching connections:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;
  if (connections.length === 0)
    return <h1 className='text-center mt-10 text-xl text-white'>No connections found!</h1>;
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center justify-center">
          <CircularProgress aria-label="Loading connections..." size="lg" color="secondary"/>
          <p className="text-purple-700 font-medium mt-4">Loading connections...</p>
        </div>
      </div>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg text-gray-600">No connections found!</p>
          <button
            onClick={() => fetchConnections()}
            className="mt-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Mobile Heading */}
      <h1 className="md:hidden text-2xl font-bold text-white mb-6 text-center">Say hello 👋</h1>
      
              {/* Mobile View - Chat List Style */}
        <div className="md:hidden space-y-6">
        {connections.map((connection) => {
          const { _id, FirstName, LastName, photoUrl } = connection;
          return (
            <Link key={_id} to={`/chat/${_id}`}>
              <div className="flex items-center p-3 m-1 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all gap-1">
                <img
                  src={photoUrl}
                  alt={`${FirstName} ${LastName}`}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                                 <div>
                   <h3 className="text-white font-semibold">{FirstName} {LastName}</h3>
                   <p className="text-gray-300 text-xs">
                     {connection.availability && connection.availability.openTo && connection.availability.openTo.length > 0
                       ? `Available for ${connection.availability.openTo.slice(0, 2).join(" • ")}`
                       : "Available for collaboration"
                     }
                   </p>
                 </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Desktop View - Original Cards */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 place-items-center mt-10">
        {connections.map((connection) => {
          const { _id, FirstName, LastName, photoUrl, age, gender, location } = connection;
          return (
            <div
              key={_id}
              className="bg-purple-100 rounded-2xl shadow-lg p-4 text-center w-56 border border-purple-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-center mb-3">
                <img
                  src={photoUrl}
                  alt={`${FirstName} ${LastName}`}
                  className="w-20 h-20 rounded-full object-cover ring-3 ring-purple-200"
                />
              </div>
              <h2 className="text-lg font-bold text-purple-800 mb-2">{FirstName} {LastName}</h2>
              <p className="text-xs text-gray-600 mb-3">Available for collaboration</p>
              <div className="mb-4 flex gap-1 justify-center">
                <span className="bg-purple-200 text-purple-800 px-2 py-1 text-xs rounded-full">
                  {age} years
                </span>
                <span className="bg-purple-300 text-purple-900 px-2 py-1 text-xs rounded-full">
                  {gender}
                </span>
              </div>
              {location && <p className="text-xs text-gray-500 mb-3">📍 {location}</p>}
              <Link to={`/chat/${_id}`}>
                <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all text-sm">
                  Say Hello 👋
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
