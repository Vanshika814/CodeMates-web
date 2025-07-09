import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Form,
  Input,
  Button,
  ToastProvider,
  addToast,
  Autocomplete, AutocompleteItem,
  Tabs, Tab,
  Select, SelectItem,
} from "@heroui/react";
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useAuth } from '@clerk/clerk-react';
import Project from './project';
import { bioPrompts } from '../utils/bioPrompts';
import { AVAILABILITY_OPTIONS } from "../utils/constants";
import ProfileUserCard from './ProfileUserCard';

const EditProfile = ({ user }) => {
  const { getToken } = useAuth();
  const [FirstName, setFirstName] = useState(user.FirstName);
  const [LastName, setLastName] = useState(user.LastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setage] = useState(user.age || "");
  const [gender, setgender] = useState(user.gender || "male");
  const [about, setabout] = useState(user.about || "");
  const [error, seterror] = useState("");
  const [linkedin, setLinkedin] = useState(user.socialLinks?.linkedin || "");
  const [github, setGithub] = useState(user.socialLinks?.github || "");
  const [portfolio, setPortfolio] = useState(user.socialLinks?.portfolio || "");
  const [twitter, setTwitter] = useState(user.socialLinks?.twitter || "");
  const [email, setEmail] = useState(user.emailId || "");

  const [location, setLocation] = useState({
  city: user.location?.city || "",
  country: user.location?.country || "",
});
  const dispatch = useDispatch();
  const [placement] = useState("top-right");
  const [activeTab, setActiveTab] = useState("about");
  const [userProjects, setUserProjects] = useState(user.projects || []);
  const [availability, setAvailability] = useState(user.availability?.openTo || []);
  const [skills, setSkills] = useState(user.skills || []);
  const [prompt, setPrompt] = useState(
    user.bioAnswers && user.bioAnswers[0] ? user.bioAnswers[0].prompt : bioPrompts[0]?.key || ''
  );
  const [answer, setAnswer] = useState(
    user.bioAnswers && user.bioAnswers[0] ? user.bioAnswers[0].answer : ''
  );
  useEffect(() => {
    if (user.bioAnswers && user.bioAnswers[0]) {
      setPrompt(user.bioAnswers[0].prompt);
      setAnswer(user.bioAnswers[0].answer);
    }
  }, [user]);
  const SaveProfile = async () => {
    seterror("");
    try {
      const token = await getToken();

      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          FirstName,
          LastName,
          age,
          gender,
          about,
          photoUrl,
          emailId: email,
          socialLinks: {
            github,
            linkedin,
            portfolio,
            twitter
          },
          location,
          projects: userProjects,
          availability: { openTo: availability.map(k => typeof k === 'string' ? k : k.key || k.currentKey) },
          skills,
          bioAnswers: [
            {
              prompt,
              answer
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      dispatch(addUser(res?.data?.data));

      addToast({
        title: "Success",
        description: "Profile updated successfully",
        color: "success",
      });
      console.log(github, linkedin, twitter);
    } catch (err) {
      seterror(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <>
      <ToastProvider placement={placement} toastOffset={placement.includes("top") ? 60 : 0} />

      <div className="flex gap-3 justify-center items-start">
        <ProfileUserCard user={{ FirstName, LastName, age, gender, about, photoUrl, socialLinks: { github, linkedin, twitter }, location: location.city + ", " + location.country }} /> 
        <Card className="w-3/5 mx-2 my-16 pt-0 h-3/4">
          <CardBody className='pt-0 '>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold p-3">
                {activeTab === "about" && "About"}
                {activeTab === "projects" && "Projects"}
                {activeTab === "contact" && "Contact"}
              </h1>
              <div className="w-64 ml-auto">
                <Tabs
                  aria-label="Edit Profile Sections"
                  selectedKey={activeTab}
                  onSelectionChange={setActiveTab}
                  variant="light"
                  size="md"
                >
                  <Tab key="about" title="About" />
                  <Tab key="projects" title="Projects" />
                  <Tab key="contact" title="Contact" />
                </Tabs>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "about" && (
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
                  errorMessage="Please enter a valid photo url"
                  label="Photo URL"
                  labelPlacement="outside"
                  placeholder="Please enter your Photo URL"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full"
                />
                <Autocomplete
                  className="w-full"
                  label="Gender"
                  labelPlacement="outside"
                  placeholder="Select your gender"
                  selectedKey={gender}
                  onSelectionChange={(key) => setgender(key)}
                  defaultItems={[
                    { label: "Male", key: "male" },
                    { label: "Female", key: "female" },
                    { label: "Other", key: "other" },
                  ]}
                  isRequired
                >
                  {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                </Autocomplete>
                <Input
                  isRequired
                  errorMessage="Please enter a valid about"
                  label="About"
                  labelPlacement="outside"
                  placeholder="Tell us about yourself"
                  value={about}
                  onChange={(e) => setabout(e.target.value)}
                  className="w-full"
                />
                <Input
                  isRequired
                  errorMessage="Please enter a valid skills"
                  label="Skills"
                  labelPlacement="outside"
                  placeholder="Enter your skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full"
                />
                <Select
                  isRequired
                  className="max-w-xs"
                  items={bioPrompts}
                  label="Prompt"
                  labelPlacement="outside"
                  placeholder="Select a prompt"
                  selectedKey={prompt}
                  onSelectionChange={(key) => {
                    if (typeof key === 'string') setPrompt(key);
                    else if (key && typeof key === 'object') setPrompt(key.key || key.currentKey);
                  }}
                >
                  {bioPrompts.map((promptObj) => (
                    <SelectItem key={promptObj.key} value={promptObj.key}>
                      {promptObj.label}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  isRequired
                  errorMessage="Please enter a valid answer"
                  label="Answer"
                  labelPlacement="outside"
                  placeholder="Enter your answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full"
                />
                <Select
                  className="w-full"
                  label="Availability"
                  labelPlacement="outside"
                  placeholder="Select your availability"
                  selectedKeys={new Set(availability.map(k => typeof k === 'string' ? k : k.key || k.currentKey))}
                  onSelectionChange={(keys) => {
                    if (Array.isArray(keys) || keys instanceof Set) {
                      setAvailability(Array.from(keys).map(k => typeof k === 'string' ? k : k.key || k.currentKey));
                    } else if (typeof keys === 'object' && keys !== null) {
                      setAvailability([keys.key || keys.currentKey]);
                    } else {
                      setAvailability([keys]);
                    }
                  }}
                  isRequired
                >
                  {AVAILABILITY_OPTIONS.map(option => (
                    <SelectItem key={option.key}>{option.label}</SelectItem>
                  ))}
                </Select>
              </Form>
            )}
            {activeTab === "projects" && (
              <Project 
                userProjects={userProjects} 
                onSave={setUserProjects}
              />
            )}
            {activeTab === "contact" && 
            <Form className="w-full max-w-xs flex flex-col items-center gap-4">
              <Input
                label="City"
                labelPlacement="outside"
                placeholder="Enter your city"
                value={location.city}
                onChange={(e) => setLocation({ ...location, city: e.target.value })}
              />
              <Input
                label="Country"
                labelPlacement="outside"
                placeholder="Enter your country"
                value={location.country}
                onChange={(e) => setLocation({ ...location, country: e.target.value })}
              />
              <Input
                label="Email"
                labelPlacement="outside"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="GitHub"
                labelPlacement="outside"
                placeholder="Enter your GitHub"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
              />
              <Input
                label="LinkedIn"
                labelPlacement="outside"
                placeholder="Enter your LinkedIn"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
              <Input
                label="Portfolio"
                labelPlacement="outside"
                placeholder="Enter your Portfolio link"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
              />
              <Input
                label="Twitter"
                labelPlacement="outside"
                placeholder="Enter your Twitter"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
              />
            </Form>
            }

            {/* === SAVE BUTTON & ERROR MESSAGE === */}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}

            <div className="flex justify-center w-full gap-3 mt-4">
              <Button color="secondary" onPress={SaveProfile}>
                Save Profile
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default EditProfile;
