import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { addConnection } from '../utils/connectionSlice';
import { useAuth } from '@clerk/clerk-react';
import { Button, Chip } from "@heroui/react";
import { Link } from "react-router"; // ✅ corrected import

const Connections = () => {
  const { getToken } = useAuth();
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const token = await getToken();

      const res = await axios.get(BASE_URL + "/user/connections", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(addConnection(res.data.data));
    } catch (err) {
      console.error("Error fetching connections:", err.message);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;
  if (connections.length === 0)
    return <h1 className='text-center mt-10 text-xl text-white'>No connections found!</h1>;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 place-items-center mt-10 p-6'>
      {connections.map((connection, index) => {
        const { _id, FirstName, LastName, photoUrl, age, gender, location, skills = [] } = connection;

        return (
          <div
            key={index}
            className="bg-purple-100 rounded-2xl shadow-lg p-4 text-center w-64 mx-auto border border-purple-200 hover:shadow-xl transition-shadow duration-300"
          >
            {/* Profile Picture */}
            <div className="flex justify-center mb-3">
              <img
                src={photoUrl || "https://via.placeholder.com/80x80?text=No+Photo"}
                alt={`${FirstName} ${LastName}`}
                className="w-20 h-20 rounded-full object-cover ring-3 ring-purple-200 shadow-md"
              />
            </div>

            {/* User Details */}
            <h2 className="text-lg font-bold text-purple-800 mb-2">{FirstName} {LastName}</h2>
            {/* Availability */}
            {connection.availability && connection.availability.openTo && connection.availability.openTo.length > 0 ? (
              <p className="text-xs text-gray-600 mb-3 px-2">
                Available for {connection.availability.openTo.slice(0, 2).join(" • ")}
              </p>
            ) : (
              <p className="text-xs text-gray-600 mb-3 px-2">
                Available for collaboration
              </p>
            )}

            {/* Skills and Info Chips */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1 justify-center">
                {/* Age Chip */}
                <span className="bg-purple-200 text-purple-800 px-2 py-1 text-xs rounded-full font-medium">
                  {age} years
                </span>
                {/* Gender Chip */}
                <span className="bg-purple-300 text-purple-900 px-2 py-1 text-xs rounded-full font-medium">
                  {gender}
                </span>
                {/* Skills Chips */}
                {skills.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="bg-purple-100 text-purple-700 px-2 py-1 text-xs rounded-full font-medium">
                    {skill}
                  </span>
                ))}
                {skills.length > 3 && (
                  <span className="bg-purple-400 text-purple-100 px-2 py-1 text-xs rounded-full font-medium">
                    +{skills.length - 3} skills
                  </span>
                )}
              </div>
            </div>

            {/* Location */}
            {location && (
              <p className="text-xs text-gray-500 mb-3">📍 {location}</p>
            )}

            {/* Action Button */}
            <Link to={`/chat/${_id}`}>
              <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm">
                Say Hello 👋
              </button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
