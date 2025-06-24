import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { addConnection } from '../utils/connectionSlice';
import { useAuth } from '@clerk/clerk-react';

const Connections = () => {
  const { getToken } = useAuth(); // Get Clerk auth helper
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const token = await getToken(); // Get Clerk token

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
    return <h1 className='text-center mt-10 text-xl'>No connections found!</h1>;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6'>
      {connections.map((connection, index) => {
        const { FirstName, LastName, photoUrl, about, age, gender } = connection;
        return (
          <div
            key={index}
            className='flex rounded-2xl overflow-hidden shadow-lg bg-slate-950 p-4 max-w-xl mx-auto'
          >
            <img
              src={photoUrl}
              alt={`${FirstName} ${LastName}`}
              className='w-32 h-32 object-cover rounded-xl'
            />
            <div className='flex flex-col justify-center ml-6 text-left'>
              <h2 className='text-xl font-semibold text-gray-800'>
                {FirstName} {LastName}
              </h2>
              <p className='text-sm text-gray-700 mt-1'>{about}</p>
              <p className='text-sm text-gray-600 mt-1'>{age} • {gender}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
