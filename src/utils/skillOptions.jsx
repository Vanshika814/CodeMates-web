import { FaUsers, FaComments, FaLightbulb, FaBug, FaPencilAlt, FaProjectDiagram, FaChalkboardTeacher, FaLanguage, FaRegClock, FaTasks } from "react-icons/fa";
import { SiTestinglibrary, SiAdobephotoshop, SiFigma, SiJirasoftware, SiSlack, SiTrello } from "react-icons/si";

export const skillOptions = [
  { label: "Teamwork", key: "teamwork", icon: <FaUsers /> },
  { label: "Communication", key: "communication", icon: <FaComments /> },
  { label: "Problem Solving", key: "problem_solving", icon: <FaLightbulb /> },
  { label: "Debugging", key: "debugging", icon: <FaBug /> },
  { label: "Writing", key: "writing", icon: <FaPencilAlt /> },
  { label: "Project Management", key: "project_management", icon: <FaProjectDiagram /> },
  { label: "Mentoring", key: "mentoring", icon: <FaChalkboardTeacher /> },
  { label: "Multilingual", key: "multilingual", icon: <FaLanguage /> },
  { label: "Time Management", key: "time_management", icon: <FaRegClock /> },
  { label: "Task Management", key: "task_management", icon: <FaTasks /> },
  { label: "Testing", key: "testing", icon: <SiTestinglibrary /> },
  { label: "UI/UX Design", key: "uiux", icon: <SiFigma /> },
  { label: "Photoshop", key: "photoshop", icon: <SiAdobephotoshop /> },
  { label: "Jira", key: "jira", icon: <SiJirasoftware /> },
  { label: "Slack", key: "slack", icon: <SiSlack /> },
  { label: "Trello", key: "trello", icon: <SiTrello /> },
  
]; 