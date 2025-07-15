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
  Textarea
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
import { skillOptions } from '../utils/skillOptions';
import { FaEnvelope, FaGithub, FaLinkedin, FaGlobe, FaTwitter } from 'react-icons/fa';

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
    user.bioAnswers && user.bioAnswers[0] 
      ? bioPrompts.find(p => p.label === user.bioAnswers[0].prompt)?.key || bioPrompts[0]?.key || ''
      : (bioPrompts[0]?.key || '')
  );
  const [answer, setAnswer] = useState(
    user.bioAnswers && user.bioAnswers[0] ? user.bioAnswers[0].answer : ''
  );
  useEffect(() => {
    if (user.bioAnswers && user.bioAnswers[0]) {
      // Find the key based on the stored label
      const foundPrompt = bioPrompts.find(p => p.label === user.bioAnswers[0].prompt);
      setPrompt(foundPrompt?.key || bioPrompts[0]?.key || '');
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
              prompt: bioPrompts.find(p => p.key === prompt)?.label || prompt,
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
    } catch (err) {
      seterror(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <>
      <ToastProvider placement={placement} toastOffset={placement.includes("top") ? 60 : 0} />

      <div className="flex gap-3 justify-center items-start">
        <ProfileUserCard 
          user={{ FirstName, LastName, age, gender, about, photoUrl, socialLinks: { github, linkedin, twitter }, location: location.city + ", " + location.country }} 
          isEditing={true}
          onImageUpload={(newUrl) => {
            setPhotoUrl(newUrl);
          }}
        /> 
        <Card className="w-3/5 mx-2 mt-8 p-4 min-h-[600px]">
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
                  color='secondary'
                >
                  <Tab key="about" title="About" />
                  <Tab key="projects" title="Projects" />
                  <Tab key="contact" title="Contact" />
                </Tabs>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "about" && (
              <Form className="w-full flex flex-col items-center gap-4">
                <Textarea
                  isRequired
                  errorMessage="Please enter a valid about"
                  variant='underlined'
                  placeholder="Tell us about yourself..."
                  value={about}
                  onChange={(e) => setabout(e.target.value)}
                  className="w-full"
                />
                <div className='w-full mb-4'>
                  <h3 className=' font-bold mb-4'>Personal Information</h3>
                  <div className='w-full grid grid-cols-2 gap-4'>
                  
                    <Input
                      isRequired
                      errorMessage="Please enter a valid First Name"
                      label="First Name"
                      color='default'
                      size='lg'
                      value={FirstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full"
                    />
                    <Input
                      errorMessage="Please enter a valid Last Name"
                      label="Last Name"
                      color='default'
                      size='lg'
                      value={LastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full"
                    />
                    <Input
                      isRequired
                      errorMessage="Please enter a valid age"
                      label="Age"
                      color='default'
                      size='lg'
                      value={age}
                      onChange={(e) => setage(e.target.value)}
                      className="w-full"
                    />
                    <Autocomplete
                      className="w-full"
                      label="Gender"
                      color='default'
                      size='lg'
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
                  </div>
                </div>
                 {/* === Profile Prompt Section === */}
                 <div className='w-full mb-4'>
                  <h3 className=' font-bold mb-4'>Profile Prompt</h3>
                  <div className='w-full grid grid-cols-2 gap-4'>
                  <Select
                    isRequired
                    className="w-full"
                    items={bioPrompts}
                    label="Prompt"
                    color='default'
                    size='lg'
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
                    color='default'
                    size='lg'
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full"
                  />
                  </div>
                 </div>
                 {/* === Skills Section === */}
                 <div className='w-full mb-4'>
                    <h3 className=' font-bold mb-4'>Skills & Work Experience</h3>
                    <div className='w-full grid grid-cols-2 gap-4'>
                      <Select
                        className="w-full"
                        label="Skills"
                        selectionMode="multiple"
                        size='lg'
                        selectedKeys={new Set(skills)}
                        onSelectionChange={(selected) => setSkills(Array.from(selected))}
                      >
                        {skillOptions.map((skill) => (
                          <SelectItem key={skill.key} startContent={skill.icon}>
                            {skill.label}
                          </SelectItem>
                        ))}
                      </Select>
                      <Select
                        className="w-full"
                        label="Availability"
                        color='default'
                        size='lg'
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
                    </div>
                  </div>
              </Form>
            )}
            {activeTab === "projects" && (
              <Project 
                userProjects={userProjects} 
                onSave={setUserProjects}
              />
            )}
            {activeTab === "contact" && 
              <Form className="w-full flex flex-col items-center gap-4">
                {/* Contact Information Section */}
                <div className="w-full mb-4">
                  <h3 className="font-bold mb-4">Contact Information</h3>
                  <div className='w-full grid grid-cols-2 gap-4'>
                    <Input
                      label="City"
                      color='default'
                      size='lg'
                      labelPlacement="inside"
                      value={location.city}
                      onChange={(e) => setLocation({ ...location, city: e.target.value })}
                    />
                    <Input
                      label="Country"
                      color='default'
                      size='lg'
                      labelPlacement="inside"
                      value={location.country}
                      onChange={(e) => setLocation({ ...location, country: e.target.value })}
                    />
                    <Input
                      label="Email"
                      color='default'
                      size='lg'
                      labelPlacement="inside"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      startContent={<FaEnvelope className="text-xl text-red-500" />}
                    />
                  </div>
                </div>
                {/* Socials Section */}
                <div className="w-full mb-4">
                  <h3 className="font-bold mb-4">Socials</h3>
                  <div className='w-full grid grid-cols-2 gap-4'>
                    <Input
                      label="GitHub"
                      color='default'
                      size='lg'
                      labelPlacement="inside"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      startContent={<FaGithub className="text-xl text-white" />}
                    />
                    <Input
                      label="LinkedIn"
                      color='default'
                      size='lg'
                      labelPlacement="inside"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      startContent={<FaLinkedin className="text-xl text-blue-600" />}
                    />
                    <Input
                      label="Portfolio"
                      color='default'
                      size='lg'
                      labelPlacement="inside"
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      startContent={<FaGlobe className="text-xl text-green-600" />}
                    />
                    <Input
                      label="Twitter"
                      color='default'
                      size='lg'
                      labelPlacement="inside"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      startContent={<FaTwitter className="text-xl text-blue-400" />}
                    />
                  </div>
                </div>
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
