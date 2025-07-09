import React from "react";
import { Card, CardHeader, CardBody, Image, Divider, CardFooter, Code } from "@heroui/react";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import { MdLocationOn } from 'react-icons/md';

const ProfileUserCard = ({ user }) => {
    const { FirstName, LastName, age, gender, about, photoUrl, socialLinks = {}, location } = user;
    const { github, linkedin, twitter } = socialLinks;

    return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-80 h-[535px] flex flex-col">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start flex-shrink-0">
        </CardHeader>
        <CardBody className="overflow-visible py-2 px-4 relative flex-1 flex flex-col">
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex flex-col items-center justify-center">
                <Image
                alt="Card photo"
                className="object-cover rounded-xl w-full h-80 flex-shrink-0"
                src={photoUrl}
                />
            </div>
            <Divider />
            <h4 className="font-bold text-large">{FirstName + " " + LastName}</h4>
            <div className="flex flex-col gap-2">
            <p className="text-tiny uppercase font-bold">
              {age + ", " + gender}
            </p>
            <div className="flex items-center gap-2">
                <MdLocationOn size={18} className="text-default-600" />
                <small className="text-default-600 line-clamp-2">{location}</small>
            </div>
            <small className="text-default-500 line-clamp-2">{about}</small>
            </div>
          </div>
        </CardBody>
        <CardFooter className="flex justify-center gap-4">
        <div className="flex justify-center gap-4">
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer">
                <FaGithub size={24} className="text-gray-700 hover:text-black" />
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={24} className="text-blue-700 hover:text-blue-900" />
              </a>
            )}
            {twitter && (
              <a href={twitter} target="_blank" rel="noopener noreferrer">
                <FaTwitter size={24} className="text-blue-500 hover:text-blue-700" />
              </a>
            )}
        </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileUserCard;