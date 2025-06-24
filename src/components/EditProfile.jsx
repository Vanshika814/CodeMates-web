import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Form,
  Input,
  Button,
  CardHeader,
  ToastProvider,
  addToast,
} from "@heroui/react";
import UserCard from './userCard';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useAuth } from '@clerk/clerk-react';

const EditProfile = ({ user }) => {
  const { getToken } = useAuth(); // Get Clerk auth helper
  const [FirstName, setFirstName] = useState(user.FirstName);
  const [LastName, setLastName] = useState(user.LastName);
  const [photoUrl, setphotoUrl] = useState(user.photoUrl);
  const [age, setage] = useState(user.age || "");
  const [gender, setgender] = useState(user.gender || "");
  const [about, setabout] = useState(user.about || "");
  const [error, seterror] = useState("");
  const dispatch = useDispatch();

  // Optional if you want to let users change placement
  const [placement] = useState("top-right");

  const SaveProfile = async () => {
    seterror("");
    try {
      const token = await getToken(); // Get Clerk token

      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          FirstName,
          LastName,
          age,
          gender,
          about,
          photoUrl
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(addUser(res?.data?.data));

      addToast({
        title: "Success",
        description: "Profile updated successfully",
        color: "success",
      });

    } catch (err) {
      seterror(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <>
      {/* ToastProvider added with default top-right placement */}
      <ToastProvider placement={placement} toastOffset={placement.includes("top") ? 60 : 0} />

      <div className="flex">
        <Card className="max-w-sm min-w-80 mx-auto my-16">
          <CardHeader className="flex justify-center text-2xl font-bold">
            Edit Profile
          </CardHeader>
          <CardBody className="flex justify-center items-center">
            <Form className="w-full max-w-xs flex flex-col items-center gap-4">
              <Input
                isRequired
                errorMessage="Please enter a valid First Name"
                label="First Name"
                labelPlacement="outside"
                placeholder="Please enter your First Name"
                value={FirstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full"
              />
              <Input
                isRequired
                errorMessage="Please enter a valid Last Name"
                label="Last Name"
                labelPlacement="outside"
                placeholder="Please enter your Last Name"
                value={LastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full"
              />
              <Input
                isRequired
                errorMessage="Please enter a valid age"
                label="Age"
                labelPlacement="outside"
                placeholder="Please enter your Age"
                value={age}
                onChange={(e) => setage(e.target.value)}
                className="w-full"
              />
              <Input
                isRequired
                errorMessage="Please enter a valid photo"
                label="photoUrl"
                labelPlacement="outside"
                placeholder="Please enter your photoUrl"
                value={photoUrl}
                onChange={(e) => setphotoUrl(e.target.value)}
                className="w-full"
              />
              <Input
                isRequired
                errorMessage="Please enter a valid gender"
                label="Gender"
                labelPlacement="outside"
                placeholder="Please enter your gender"
                value={gender}
                onChange={(e) => setgender(e.target.value)}
                className="w-full"
              />
              <Input
                isRequired
                errorMessage="Please enter a valid about"
                label="About"
                labelPlacement="outside"
                placeholder="Please enter your about"
                value={about}
                onChange={(e) => setabout(e.target.value)}
                className="w-full"
              />

              {error && <p className="text-red-500 text-center">{error}</p>}

              <div className="flex justify-center w-full gap-3">
                <Button color="secondary" onPress={SaveProfile}>
                  Save Profile
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>

        <UserCard user={{ FirstName, LastName, age, gender, about, photoUrl }} />
      </div>
    </>
  );
};

export default EditProfile;
