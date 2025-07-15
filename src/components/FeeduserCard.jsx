import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Card, CardHeader, CardBody, CardFooter, Image, Button, Chip } from "@heroui/react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeuserfromFeed } from "../utils/feedSlice";
import { useAuth } from "@clerk/clerk-react";

export const HeartIcon = ({
  fill = "currentColor",
  filled,
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill={filled ? fill : "none"}
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const CloseCircleIcon = ({
  fill = "currentColor",
  filled,
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill={filled ? fill : "none"}
      height={size || height || 24}
      width={size || width || 24}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9.5"
        stroke={fill}
        strokeWidth="1.5"
        fill={"none"}
      />
      <line
        x1="9"
        y1="9"
        x2="15"
        y2="15"
        stroke={filled ? "#fff" : fill}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="15"
        y1="9"
        x2="9"
        y2="15"
        stroke={filled ? "#fff" : fill}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

const UserCard = ({ user}) => {
  const { _id, FirstName, LastName, age, gender, projects, about, skills = [], availability, bioAnswers } = user;
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const [showDetails, setShowDetails] = useState(false);

  const handleSendRequest = async (status, userId) => {
    try {
      const token = await getToken();

      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(removeuserfromFeed(userId));
      console.log("✅ Request sent successfully:", res.data);
    } catch (err) {
      console.error(
        "❌ Error sending request:",
        err?.response?.data || err.message
      );
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-4 mt-6">
      <div className="flex gap-6 max-w-6xl w-full justify-center items-start">
        {/* Main Card */}
        <Card className="w-80 h-[510px] flex flex-col flex-shrink-0 shadow-2xl border-0 overflow-hidden">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start flex-shrink-0">
          </CardHeader>
          <CardBody className="overflow-hidden py-0 px-4 relative flex-1 flex flex-col">
                        <div className="flex-1 flex flex-col">
                <div className="relative w-full h-[290px] rounded-2xl overflow-hidden shadow-lg mt-2">
                <Image
                  alt="Card photo"
                  className="w-full h-full object-cover object-center"
                  src={user.photoUrl}
                  style={{ objectFit: 'cover' }}
                />
                
                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                
                {/* Name and Age Overlay - Bottom Left */}
                <div className="absolute bottom-4 left-4 z-10">
                  <h4 className="font-bold text-white text-xl leading-tight drop-shadow-2xl mb-1">{FirstName + " " + LastName}</h4>
                  {age && gender && (
                    <p className="text-white/95 text-sm font-medium drop-shadow-lg bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
                      {age + ", " + gender}
                    </p>
                  )}
                </div>
                
                {/* Details Toggle Button */}
                <div className="absolute top-4 right-4 z-10">
                  <Button 
                    isIconOnly
                    onPress={() => setShowDetails(!showDetails)}
                    radius="full"
                    variant="flat"
                    className="text-white bg-black/30 backdrop-blur-md hover:bg-black/50 border border-white/20 shadow-lg transition-all duration-300"
                    aria-label="Toggle Details"
                  >
                    <span role="img" aria-label="details" className="text-lg">📝</span>
                  </Button>
                </div>
              </div>
              
              {/* Skills */}
              {skills.length > 0 && (
                <div className="mt-3 px-1">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-lg">
                    <div className="flex flex-wrap items-center text-sm">
                      <span className="font-semibold text-purple-300 mr-2">🛠️ Skills -</span>
                      <span className="text-gray-100 font-medium text-sm">
                        {skills.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Availability */}
              {availability && availability.openTo && availability.openTo.length > 0 && (
                <div className="mt-2 px-1">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-lg">
                    <div className="flex flex-wrap items-center text-sm">
                      <span className="font-semibold text-purple-200 mr-2">🔍 Looking for -</span>
                      <span className="text-white font-medium">
                        {availability.openTo.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full flex flex-col items-center z-10">
                <span className="text-xs text-white mb-2">ready to code?</span>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    className="bg-gradient-to-r from-[#caa8ff] to-[#f0e0ff] text-black"
                    radius='full'
                    aria-label="Like"
                    color="danger"
                    onPress={() => handleSendRequest("interested", _id)}
                  >
                    <HeartIcon filled />
                  </Button>
                  <Button
                    radius='full'
                    aria-label="dislike"
                    color="default"
                    variant="bordered"
                    onPress={() => handleSendRequest("ignored", _id)}
                  >
                    <CloseCircleIcon filled />
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Details Panel */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="w-96 bg-gradient-to-br from-[#1e1e1e] to-[#2f1a3c] rounded-xl p-6 shadow-xl max-h-[510px] overflow-y-auto scrollbar-hide"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-bold text-xl">📝 About me</h2>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => setShowDetails(false)}
                className="text-white hover:bg-white/10"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              {/* About Section */}
              {about && (
                <div className="backdrop-blur-sm rounded-xl p-4 bg-white/5">
                  <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                    <span>👤</span> About
                  </h3>
                  <div className="text-white/90 text-sm font-medium leading-relaxed">{about}</div>
                </div>
              )}

              {/* Projects Section */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <span>💻</span> Projects
                </h3>
                {projects && projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: index * 0.1,
                          duration: 0.3 
                        }}
                      >
                                                 <Card className="bg-gradient-to-br from-[#2a2a2a] to-[#3d2a5c] border-none overflow-hidden">
                           <CardBody className="p-0">
                             <div className="relative w-full h-40 overflow-hidden">
                               <Image
                                 alt={item.title}
                                 className="w-full h-full object-cover object-center"
                                 src={item.imageUrl}
                                 radius="none"
                                 style={{ objectFit: 'cover' }}
                               />
                             </div>
                            <div className="p-4">
                              <h4 className="text-white font-bold text-sm mb-2">{item.title}</h4>
                              <p className="text-white/80 text-xs mb-3 line-clamp-2">{item.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {(item.tech || item.techUsed || []).map((tech, idx) => (
                                  <Chip key={idx} size="sm" variant="flat" className="text-xs bg-purple-500/20 text-purple-300">
                                    {tech}
                                  </Chip>
                                ))}
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8 text-sm">No projects to display.</div>
                )}
              </div>

              {/* Bio Prompts Section */}
              {bioAnswers && bioAnswers.length > 0 && bioAnswers[0] && (
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-4 border border-purple-300/30">
                  <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                    <span>💭</span> {bioAnswers[0].prompt}
                  </h3>
                  <div className="text-white/90 text-sm font-medium leading-relaxed bg-black/20 rounded-lg p-3">
                    {bioAnswers[0].answer}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserCard;