import axios from 'axios';
import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addrequest, removerequest } from '../utils/requestsSlice';
import { Button } from "@heroui/react";
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
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6'>
      {requests.map((request, index) => {
        const { FirstName, LastName, photoUrl, about, age, gender } = request.fromUserId;
        return (
          <div
            key={index}
            className='flex rounded-2xl overflow-hidden shadow-lg bg-slate-950 p-4 max-w-xl mx-auto'
          >
            <img src={photoUrl} alt={`${FirstName} ${LastName}`} className='w-32 h-32 object-cover rounded-xl' />
            <div className='flex flex-col justify-center ml-6 text-left'>
              <h2 className='text-xl font-semibold text-gray-800'>{FirstName} {LastName}</h2>
              <p className='text-sm text-gray-700 mt-1'>{about}</p>
              <p className='text-sm text-gray-600 mt-1'>{age} • {gender}</p>
              <div className='flex gap-4 mt-4'>
                <Button isIconOnly color="success" variant="solid" onPress={() => reviewRequest("accepted", request._id)}>
                  <TickIcon />
                </Button>
                <Button isIconOnly color="danger" variant="solid" onPress={() => reviewRequest("rejected", request._id)}>
                  <CrossIcon />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
