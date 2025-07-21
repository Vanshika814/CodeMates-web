// src/components/Footer.jsx
import React from "react";
import { FaTwitter, FaYoutube, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className=" text-white text-center py-6 w-full ">
      <div className="flex justify-center gap-6 text-2xl mb-4">
        <a href="#"><FaTwitter /></a>
        <a href="#"><FaYoutube /></a>
        <a href="#"><FaFacebook /></a>
      </div>
      <p className="text-sm">&copy; 2025 - All right reserved by CodeMates</p>
    </footer>
  );
};

export default Footer;
