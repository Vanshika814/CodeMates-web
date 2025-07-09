// Local backend URL
export const BASE_URL = location.hostname=== "localhost" ? "http://localhost:3000" : "https://devtinder-backend-iemz.onrender.com";

export const AVAILABILITY_OPTIONS = [
  { key: "freelance", label: "Freelance" },
  { key: "internship", label: "Internship" },
  { key: "hackathon", label: "Hackathon" },
  { key: "projectHelp", label: "Project Help" }
];
