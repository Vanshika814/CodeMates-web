import axios from 'axios';
import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addrequest, removerequest } from '../utils/requestsSlice';
import { Button, Card, CardHeader, CardBody, Image, CardFooter, Chip } from "@heroui/react";
import { useAuth } from '@clerk/clerk-react'; // ✅ Clerk auth

const TickIcon = ({ fill = "currentColor", size = 24, ...props }) => (
  <svg fill="none" stroke={fill} strokeWidth="1.5" viewBox="0 0 24 24" width={size} height={size} {...props}>
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CrossIcon = ({ fill = "currentColor", size = 24, ...props }) => (
  <svg fill="none" stroke={fill} strokeWidth="1.5" viewBox="0 0 24 24" width={size} height={size} {...props}>
    <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Requests = () => {
  const { getToken } = useAuth(); // ✅ Get Clerk token
  const requests = useSelector((store) => store.request);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      const token = await getToken();
      await axios.post(
        `${BASE_URL}/request/review/${status}/${_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }, withCredentials: true,
        }
      );
      dispatch(removerequest(_id));
    } catch (err) {
      console.error("Error reviewing request:", err.message);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${BASE_URL}/user/request/received`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }, withCredentials: true,
      });
      dispatch(addrequest(res.data.data));
    } catch (err) {
      console.error("Error fetching requests:", err.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;
  if (requests.length === 0)
    return <h1 className='text-center mt-10 text-xl text-white'>No requests found!</h1>;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 place-items-center mt-6 p-6'>
      {requests.map((request, index) => {
        const { FirstName, LastName, photoUrl, age, gender, skills = [] } = request.fromUserId;
        return (
          <div 
            key={index}
            className="bg-purple-900/40 backdrop-blur-md border border-purple-700/30 p-3 rounded-2xl w-60 h-80 shadow-xl flex flex-col items-center text-purple-100 transition hover:scale-105 duration-300"
          >
            <div className="flex flex-col items-center flex-grow w-full">
              <img
                src={photoUrl || "https://via.placeholder.com/96x96?text=No+Photo"}
                alt={`${FirstName} ${LastName}`}
                className="w-24 h-24 rounded-full border-4 border-purple-400 object-cover shadow-md mb-3"
              />

              <div className="text-center mb-3">
                <h3 className="text-lg font-bold text-purple-100">{FirstName} {LastName}</h3>
                <p className="text-sm text-purple-300">{age} • {gender}</p>
              </div>

              {/* Skills */}
              {skills.length > 0 && (
                <div className="w-full mb-4 px-1">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20 shadow-lg">
                    <div className="flex flex-wrap items-center text-sm">
                      <span className="font-semibold text-purple-300 mr-2">🛠️ Skills -</span>
                      <span className="text-purple-200 font-medium text-sm">
                        {skills.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-auto">
              <Button 
                radius='full'
                variant='flat'
                className="bg-gradient-to-r from-purple-600/80 to-purple-500/80 text-white flex items-center justify-center shadow-md transition hover:from-purple-600 hover:to-purple-500"
                onPress={() => reviewRequest("accepted", request._id)}
              >
                Accept
              </Button>
                             <Button 
                 radius='full'
                 variant='flat'
                 className="rounded-full border-2 border-purple-500 text-purple-300 text-sm flex items-center justify-center hover:bg-purple-800/50 transition"
                 onPress={() => reviewRequest("rejected", request._id)}
               >
                 Decline
               </Button>
            </div>
          </div>
        );
      })}
        </div>
  );
};

export default Requests;
