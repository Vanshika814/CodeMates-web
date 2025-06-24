// src/components/Footer.jsx
import React from "react";
import { FaTwitter, FaYoutube, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className=" text-white text-center py-6 w-full ">
      <div className="flex justify-center gap-6 mb-4">
        <a href="#" className="hover:underline">About us</a>
        <a href="#" className="hover:underline">Contact</a>
        <a href="#" className="hover:underline">Jobs</a>
        <a href="#" className="hover:underline">Press kit</a>
      </div>
      <div className="flex justify-center gap-6 text-2xl mb-4">
        <a href="#"><FaTwitter /></a>
        <a href="#"><FaYoutube /></a>
        <a href="#"><FaFacebook /></a>
      </div>
      <p className="text-sm">&copy; 2025 - All right reserved by DevTinder</p>
    </footer>
  );
};

export default Footer;
