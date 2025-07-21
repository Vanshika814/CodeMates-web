import axios from 'axios';
import React, { useEffect, useState } from 'react'; // Import useState
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addrequest, removerequest } from '../utils/requestsSlice';
import {
  Button,
  Modal,           // Import Modal
  ModalContent,    // Import ModalContent
  ModalBody,       // Import ModalBody
  useDisclosure,   // Import useDisclosure
  CircularProgress,
} from "@heroui/react";
import { useAuth } from '@clerk/clerk-react';
import ProjectCard from './ProjectCard';
import { FaCheck, FaTimes } from 'react-icons/fa';

const Requests = () => {
  const { getToken } = useAuth();
  const requests = useSelector((store) => store.request);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // Modal State
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // State to hold data for the user whose card was clicked
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

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
      // If the currently selected user in the modal was just reviewed, close the modal
      if (selectedRequestId === _id) {
        onOpenChange(false); // Close the modal
        setSelectedUser(null);
        setSelectedRequestId(null);
      }
    } catch (err) {
      console.error("Error reviewing request:", err.message);
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await axios.get(`${BASE_URL}/user/request/received`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }, withCredentials: true,
      });
      dispatch(addrequest(res.data.data));
    } catch (err) {
      console.error("Error fetching requests:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Function to handle card click - opens modal and sets selected user
  const handleCardClick = (request) => {
    setSelectedUser(request.fromUserId); // Set the user data to be displayed in the modal
    setSelectedRequestId(request._id); // Set the request ID for modal buttons
    onOpen(); // Open the modal
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center justify-center">
          <CircularProgress aria-label="Loading requests..." size="lg" color="secondary"/>
          <p className="text-purple-700 font-medium mt-4">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg text-gray-600">No requests found!</p>
          <button
            onClick={() => fetchRequests()}
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
      <h1 className="md:hidden text-2xl font-bold text-white mb-6 text-center">Connection Requests 💌</h1>
      
      {/* Mobile View - Simple List */}
      <div className="md:hidden space-y-4">
        {requests.map((request) => {
          const { FirstName, LastName, photoUrl } = request.fromUserId;
          return (
            <div
              key={request._id}
              className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all"
            >
              <div className="flex items-center flex-1">
                <img
                  src={photoUrl}
                  alt={`${FirstName} ${LastName}`}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                  <h3 
                    className="text-white font-semibold cursor-pointer hover:text-purple-300 transition-colors"
                    onClick={() => handleCardClick(request)}
                  >
                    {FirstName} {LastName}
                  </h3>
                  <p className="text-gray-300 text-xs">Wants to connect</p>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-2 ml-3">
                <Button
                  isIconOnly
                  size="sm"
                  variant='flat'
                  color='secondary'
                  onPress={() => {
                    reviewRequest("accepted", request._id);
                  }}
                  className=" border-purple-300"
                >
                  <FaCheck className="text-purple-500" />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  color='secondary'
                  onPress={() => {
                    reviewRequest("rejected", request._id);
                  }}
                  className=" border-purple-300"
                >
                  <FaTimes className="text-purple-500" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop View - Original Cards */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 place-items-center mt-6">
        {requests.map((request) => {
          const { FirstName, LastName, photoUrl, age, gender } = request.fromUserId;
          return (
            <div
              key={request._id}
              className="bg-purple-900/40 backdrop-blur-md border border-purple-700/30 p-3 rounded-2xl w-56 h-72 shadow-xl flex flex-col items-center text-purple-100 transition hover:scale-105 duration-300"
            >
              <div className="flex flex-col items-center flex-grow w-full">
                <img
                  src={photoUrl}
                  alt={`${FirstName} ${LastName}`}
                  className="w-24 h-24 rounded-full border-4 border-purple-400 object-cover shadow-md mb-3"
                />

                <div className="text-center mb-3">
                  <h3 className="text-lg font-bold text-purple-100">{FirstName} {LastName}</h3>
                  <p className="text-sm text-purple-300">{age} • {gender}</p>
                </div>
                <div className="w-full mb-4 px-1">
                  <div 
                    className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20 shadow-lg cursor-pointer hover:bg-white/20 transition-all"
                    onClick={() => handleCardClick(request)}
                  >
                    <div className="flex flex-wrap items-center text-sm">
                      <span className="font-semibold text-purple-300 mr-2">👤 View Profile </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                <Button
                  radius='full'
                  variant='flat'
                  className="bg-gradient-to-r from-purple-600/80 to-purple-500/80 text-white flex items-center justify-center shadow-md transition hover:from-purple-600 hover:to-purple-500"
                  onPress={(e) => reviewRequest("accepted", request._id, e)}
                >
                  Accept
                </Button>
                <Button
                  radius='full'
                  variant='flat'
                  className="rounded-full border-2 border-purple-500 text-purple-300 text-sm flex items-center justify-center hover:bg-purple-800/50 transition"
                  onPress={(e) => reviewRequest("rejected", request._id, e)}
                >
                  Decline
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Modal Component --- */}
      <Modal
        isKeyboardDismissDisabled={true} // Prevent closing with ESC key
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size='sm'
        scrollBehavior='inside'
      >
        <ModalContent>
          {() => (
            <>
              <ModalBody className="text-purple-200 space-y-3">
                {selectedUser ? (
                  <>
                    <div className='text-xl font-bold'>
                      {selectedUser ? `${selectedUser.FirstName} ${selectedUser.LastName}` : "User Details"}
                    </div>
                    {/* About Section */}
                    {selectedUser.about && (
                      <div className="backdrop-blur-sm rounded-xl p-4 bg-white/5">
                        <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                          <span>👤</span> About
                        </h3>
                        <div className="text-white/90 text-xs font-medium leading-relaxed">{selectedUser.about}</div>
                      </div>
                    )}
                    
                    {selectedUser.skills && selectedUser.skills.length > 0 && (
                      <p><strong>🛠️ Skills - </strong> {selectedUser.skills.join(', ')}</p>
                    )}

                    {/* Availability */}
                    {selectedUser.availability && selectedUser.availability.openTo && selectedUser.availability.openTo.length > 0 && (
                      <div>
                        <div className=" backdrop-blur-md rounded-xl ">
                          <div className="flex flex-wrap items-center text-md">
                            <span className="font-semibold text-purple-200 mr-2 text-md">🔍 Looking for -</span>
                            <span className="text-white text-md">
                              {selectedUser.availability.openTo.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                      )}
                     {/* Projects Section */}
                     {selectedUser.projects && selectedUser.projects.length > 0 && (
                       <div>
                         <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                           <span>💻</span> Projects
                         </h3>
                         <ProjectCard projects={selectedUser.projects} />
                       </div>
                     )}
                     {/* Bio Prompts Section */}
                     {selectedUser.bioAnswers && selectedUser.bioAnswers.length > 0 && selectedUser.bioAnswers[0] && (
                       <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-4 border border-purple-300/30">
                         <h3 className="text-white font-bold text-xs mb-2 flex items-center gap-2">
                           <span>💭</span> {selectedUser.bioAnswers[0].prompt}
                         </h3>
                         <div className="text-white/90 text-xs font-medium leading-relaxed bg-black/20 rounded-lg p-3">
                           {selectedUser.bioAnswers[0].answer}
                         </div>
                       </div>
                     )}
                  </>
                ) : (
                  <p>No user data available.</p>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
export default Requests;