import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addrequest } from '../utils/requestsSlice'
import { Button } from "@heroui/react";

// Tick icon
const TickIcon = ({ fill = "currentColor", size = 24, ...props }) => (
  <svg
    fill="none"
    stroke={fill}
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Cross icon
const CrossIcon = ({ fill = "currentColor", size = 24, ...props }) => (
  <svg
    fill="none"
    stroke={fill}
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


const Requests = () => {
    const requests = useSelector((store) => store.request);
    const dispatch = useDispatch();
 
    const  fetchRequests = async() => {
        try{
            const res = await axios.get(BASE_URL + "/user/request/received", {withCredentials: true});
            console.log(res.data.data);
            dispatch(addrequest(res.data.data));
        } catch(err){
            console.err("Error fetching connections:", err.message)
        }
    }

    useEffect(() => {
        fetchRequests();
    },[])

    if (!requests) return null;
    if (requests.length === 0)
      return <h1 className='text-center mt-10 text-xl'>No requests found!</h1>;
  
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6'>
        {requests.map((request, index) => {
          const { FirstName, LastName, photoUrl, about, age, gender } = request.fromUserId;
          return (
            <div
              key={index}
              className='flex rounded-2xl overflow-hidden shadow-lg bg-slate-950 p-4 max-w-xl mx-auto'
            >
              {/* Left: Image */}
              <img
                src={photoUrl}
                alt={`${FirstName} ${LastName}`}
                className='w-32 h-32 object-cover rounded-xl'
              />
  
              {/* Right: Text Info */}
              <div className='flex flex-col justify-center ml-6 text-left'>
                <h2 className='text-xl font-semibold text-gray-800'>
                  {FirstName} {LastName}
                </h2>
                <p className='text-sm text-gray-700 mt-1'>{about}</p>
                <p className='text-sm text-gray-600 mt-1'>{age} • {gender}</p>
                 {/* Action Buttons */}
              <div className='flex gap-4 mt-4'>
                <Button
                  isIconOnly
                  aria-label="Accept Request"
                  color="success"
                  variant="solid"
                >
                  <TickIcon />
                </Button>
                <Button
                  isIconOnly
                  aria-label="Reject Request"
                  color="danger"
                  variant="solid"
                >
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
  