import React from "react";
import { Card, CardHeader, CardBody, Image, Button } from "@heroui/react";
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

export const CrossIcon = ({
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
        d="M6 6l12 12M6 18L18 6"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const UserCard = ({ user }) => {
  const { _id, FirstName, LastName, photoUrl, age, gender, about } = user;
  const { getToken } = useAuth(); // Get Clerk auth helper
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const token = await getToken(); // Get Clerk token

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
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-fit max-w-sm">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">{FirstName + " " + LastName}</h4>
          {age && gender && (
            <p className="text-tiny uppercase font-bold">
              {age + ", " + gender}
            </p>
          )}
          <small className="text-default-500">{about}</small>
        </CardHeader>
        <CardBody className=" overflow-visible py-2 px-4 relative">
          <div>
            <Image
              alt="Card photo"
              className="object-cover rounded-xl"
              src={user.photoUrl}
            />
            <div className=" absolute bottom-4 right-6 flex gap-2 z-10">
              <Button
                isIconOnly
                aria-label="Like"
                color="danger"
                onPress={() => handleSendRequest("interested", _id)}
              >
                <HeartIcon filled />
              </Button>
              <Button
                isIconOnly
                aria-label="dislike"
                color="default"
                variant="flat"
                onPress={() => handleSendRequest("ignored", _id)}
              >
                <CrossIcon filled />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default UserCard;