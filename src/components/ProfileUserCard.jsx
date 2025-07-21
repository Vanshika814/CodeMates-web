import React, { useState, useRef } from "react";
import { Card, CardHeader, CardBody, Divider, CardFooter, Button, Spinner,Input } from "@heroui/react";
import { FaLinkedin, FaGithub, FaTwitter, FaCamera, FaUpload, FaGlobe, FaUser, FaBirthdayCake, FaVenusMars, FaEdit } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ProfileUserCard = ({ user, onImageUpload, isEditing = false }) => {
  const { FirstName, LastName, age, gender, photoUrl, socialLinks = {} } = user;
  const { github, linkedin, twitter } = socialLinks;

  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!previewUrl) return;
    setIsUploading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/profile/upload/profile`,
        { image: previewUrl },
        { withCredentials: true }
      );
      if (res.data.success) {
        onImageUpload(res.data.imageUrl);
        setPreviewUrl(null);
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert(err.response?.data?.error || err.message || "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex justify-center items-start p-2 sm:p-4 h-full mt-2 sm:mt-4">
      <Card className="w-72 sm:w-72 lg:w-72 h-auto flex flex-col">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start flex-shrink-0"></CardHeader>
        <CardBody className="overflow-visible py-2 px-4 relative flex-1 flex flex-col">
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex flex-col items-center justify-center w-full">
              {isEditing ? (
                <div className="relative w-full">
                  <img
                    alt="Profile"
                    className="object-cover rounded-xl w-full h-64 sm:h-72 lg:h-80 cursor-pointer hover:opacity-80"
                    src={previewUrl || photoUrl}
                    onClick={handleUploadClick}
                  />
                  {/* Desktop hover overlay */}
                  <div className="hidden sm:flex absolute inset-0 items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/30 rounded-xl">
                    <Button
                      color="primary"
                      variant="flat"
                      startContent={<FaCamera />}
                      onPress={handleUploadClick}
                      className="bg-black/70 text-white hover:bg-black/80"
                    >
                      Change Photo
                    </Button>
                  </div>
                  
                  {/* Mobile edit icon */}
                  <Button
                    isIconOnly
                    size="sm"
                    onPress={handleUploadClick}
                    className="sm:hidden absolute bottom-2 right-2 bg-purple-600 text-white rounded-full shadow-lg"
                  >
                    <FaEdit size={14} />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {previewUrl && (
                    <div className="mt-4 flex gap-2">
                      <Button
                        color="primary"
                        startContent={isUploading ? <Spinner size="sm" /> : <FaUpload />}
                        onPress={uploadImage}
                        isLoading={isUploading}
                        className="flex-1"
                      >
                        {isUploading ? "Uploading..." : "Upload Photo"}
                      </Button>
                      <Button
                        color="default"
                        variant="flat"
                        onPress={() => {
                          setPreviewUrl(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <img
                  alt="Card photo"
                  className="object-cover rounded-xl w-full h-64 sm:h-80 lg:h-96 flex-shrink-0"
                  src={photoUrl}
                />
              )}
            </div>
            <Divider />
            {isEditing ? (
              <div className="flex flex-col gap-2 w-full">
                <Input
                  variant="flat"
                  value={FirstName}
                  placeholder="First Name"
                  className="bg-[#2A1B3D] text-[#EAEAEA] placeholder-gray-400 border border-[#3B2F52] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A855F7] focus:border-[#A855F7]"
                  startContent={<FaUser className="text-[#A855F7] text-lg" />}
                />
                <Input
                  variant="flat"
                  value={LastName}
                  placeholder="Last Name"
                  className="bg-[#2A1B3D] text-[#EAEAEA] placeholder-gray-400 border border-[#3B2F52] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A855F7] focus:border-[#A855F7]"
                  startContent={<FaUser className="text-[#A855F7] text-lg" />}
                />
                <Input
                  variant="flat"
                  value={age}
                  placeholder="Age"
                  className="bg-[#2A1B3D] text-[#EAEAEA] placeholder-gray-400 border border-[#3B2F52] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A855F7] focus:border-[#A855F7]"
                  startContent={<FaBirthdayCake className="text-[#A855F7] text-lg" />}
                  readOnly
                />
                <Input
                  variant="flat"
                  value={gender}
                  placeholder="Gender"
                  className="bg-[#2A1B3D] text-[#EAEAEA] placeholder-gray-400 border border-[#3B2F52] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A855F7] focus:border-[#A855F7]"
                  readOnly
                />
              </div>
            ) : (
              <h4 className="font-bold text-large">{FirstName + " " + LastName}</h4>
            )}
            <div className="flex flex-col gap-2">
              
            </div>
          </div>
        </CardBody>
        <CardFooter className="flex flex-wrap justify-center gap-2">
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 hover:bg-purple-200 border border-purple-200 text-purple-700 font-medium transition hover:text-purple-900">
              <FaGithub size={18} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 hover:bg-purple-200 border border-purple-200 text-purple-700 font-medium transition hover:text-purple-900">
              <FaLinkedin size={18} />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
          )}
          {twitter && (
            <a href={twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 hover:bg-purple-200 border border-purple-200 text-purple-700 font-medium transition hover:text-purple-900">
              <FaTwitter size={18} />
              <span className="hidden sm:inline">Twitter</span>
            </a>
          )}
          {user.socialLinks?.portfolio && (
            <a href={user.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 hover:bg-purple-200 border border-purple-200 text-purple-700 font-medium transition hover:text-purple-900">
              <FaGlobe size={18} />
              <span className="hidden sm:inline">Portfolio</span>
            </a>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileUserCard;
