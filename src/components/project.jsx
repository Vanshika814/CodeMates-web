import React, { useState, useEffect } from 'react';
import { techStack } from '../utils/techOptions';
import { Select, SelectItem } from "@heroui/react";
import { BASE_URL } from '../utils/constants';
import axios from 'axios';

import {
  Card,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Form,
  Input,
  CardBody,
  CardFooter,
  Image,
  Chip
} from "@heroui/react";
import PlusIcon from './icons/PlusIcon';

const Project = ({ userProjects = [], onSave }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [projects, setProjects] = useState(userProjects);
  const [selectedTechStack, setSelectedTechStack] = useState(new Set());
  const [imagePreview, setImagePreview] = useState("");
  const [projectData, setProjectData] = useState({
    title: "",
    techStack: [],
    description: "",
    imageUrl: ""
  });

  useEffect(() => {
    setProjects(userProjects);
  }, [userProjects]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        try {
          const res = await axios.post(BASE_URL + "/profile/upload/project", { image: base64Image });
          setProjectData(prev => ({
            ...prev,
            imageUrl: res.data.imageUrl,
          }));
          setImagePreview(res.data.imageUrl);
        } catch (err) {
          console.error("Image upload failed:", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleAddProject = () => {
    if (!projectData.title.trim()) return alert("Please enter a project title");
    if (selectedTechStack.size === 0) return alert("Please select at least one technology");
    if (!projectData.description.trim()) return alert("Please enter a project description");
    if (!projectData.imageUrl) return alert("Please upload a project image");

    const selectedTechLabels = Array.from(selectedTechStack)
      .map((key) => techStack.find((tech) => tech.key === key)?.label)
      .filter(Boolean);

    const newProject = {
      title: projectData.title.trim(),
      description: projectData.description.trim(),
      techUsed: selectedTechLabels,
      imageUrl: projectData.imageUrl
    };

    const updated = [...projects, newProject];
    setProjects(updated);
    onSave(updated);
    setProjectData({ title: "", techStack: [], description: "", imageUrl: "" });
    setImagePreview("");
    setSelectedTechStack(new Set());
    onOpenChange();
  };

  return (
    <div>
      <div className="gap-7 grid grid-cols-2 sm:grid-cols-2 mt-4 mb-4 items-start">
        {projects.map((item, index) => (
          <Card key={index} isPressable shadow="sm" className="h-full flex flex-col bg-gradient-to-br from-[#1e1e1e] to-[#2f1a3c] hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
            <CardBody className="overflow-visible p-0 flex-shrink-0">
              <Image
                isZoomed
                alt={item.title}
                className="w-full object-cover h-[240px]"
                radius="lg"
                shadow="sm"
                src={item.imageUrl}
                width="100%"
              />
            </CardBody>
            <CardFooter className="flex flex-col items-start gap-2 flex-grow">
              <h2 className="text-lg font-bold mb-1 text-left">{item.title}</h2>
              <p className="text-sm mb-2 text-white text-left flex-grow">{item.description}</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {(item.tech || item.techUsed || []).map((tech, idx) => (
                  <Chip key={idx} color="secondary" variant="flat" radius="sm" className="text-xs px-2 py-1">
                    {tech}
                  </Chip>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
        <Card
          isPressable
          shadow="sm"
          onPress={onOpen}
          className="flex items-center justify-center border-dashed border-2 border-gray-500 hover:border-primary"
        >
          <CardBody className="flex flex-col items-center justify-center p-8">
            <PlusIcon size={30} />
            <p className="text-sm mt-2">Add Project</p>
          </CardBody>
        </Card>
      </div>

      <Modal
        backdrop="opaque"
        // classNames={{ backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20" }}
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <ModalHeader>Add a Project</ModalHeader>
          <ModalBody>
            <Form>
              <Input
                label="Title"
                name="title"
                variant="bordered"
                value={projectData.title}
                onChange={handleChange}
              />
              <Select
                className="w-full"
                variant="bordered"
                label="Tech Stack"
                labelPlacement="inside"
                selectionMode="multiple"
                selectedKeys={selectedTechStack}
                onSelectionChange={setSelectedTechStack}
              >
                {techStack.map((tech) => (
                  <SelectItem key={tech.key} startContent={tech.icon}>
                    {tech.label}
                  </SelectItem>
                ))}
              </Select>
              <Input
                label="Description"
                name="description"
                variant="bordered"
                value={projectData.description}
                onChange={handleChange}
              />
            </Form>
            <div className="flex flex-col items-center mt-2">
              <label
                htmlFor="project-image-upload"
                className="w-full h-28 flex items-center justify-center border-2 border-[#27272a] bg-[#18181b] rounded-lg cursor-pointer transition-colors hover:border-primary"
              >
                {imagePreview ? (
                  <div className="text-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded mx-auto mb-2"
                    />
                    <span className="text-sm text-green-500">Image uploaded ✓</span>
                  </div>
                ) : (
                  <>
                    <PlusIcon size={20} />
                    <span className="ml-2 text-sm">Upload Project Image</span>
                  </>
                )}
              </label>
              <input
                id="project-image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onPress={onOpenChange} variant="light">Close</Button>
            <Button type="button" className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20" color="primary" onPress={handleAddProject}>Add</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Project;
