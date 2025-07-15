import React from 'react';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#1D1D1B] relative overflow-hidden">
             {/* Background pattern */}
       {/* Background grid pattern overlay */}
               <div className="absolute inset-0 z-0 bg-[rgba(0,0,0,0.4)] bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
      
      {/* Floating Cards */}
      <motion.div 
        className="absolute top-20 left-20 bg-gradient-to-r from-pink-500 to-rose-500 p-4 rounded-2xl shadow-2xl max-w-xs"
        initial={{ opacity: 0, y: -50, rotate: -5 }}
        animate={{ opacity: 1, y: 0, rotate: -5 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h3 className="text-white font-bold text-lg mb-2">💻 Code Together</h3>
        <p className="text-white/90 text-sm">Connect with developers who share your passion for building amazing projects</p>
      </motion.div>

      <motion.div 
        className="absolute top-32 right-16 bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-2xl shadow-2xl max-w-xs"
        initial={{ opacity: 0, y: -50, rotate: 8 }}
        animate={{ opacity: 1, y: 0, rotate: 8 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h3 className="text-white font-bold text-lg mb-2">🚀 Skills Match</h3>
        <p className="text-white/90 text-sm">Find developers with complementary skills to level up your coding journey</p>
      </motion.div>

      <motion.div 
        className="absolute bottom-32 left-32 bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl shadow-2xl max-w-xs"
        initial={{ opacity: 0, y: 50, rotate: 5 }}
        animate={{ opacity: 1, y: 0, rotate: 5 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h3 className="text-white font-bold text-lg mb-2">🌐 Global Network</h3>
        <p className="text-white/90 text-sm">Join a worldwide community of developers ready to collaborate</p>
      </motion.div>

      <motion.div 
        className="absolute bottom-20 right-24 bg-gradient-to-r from-purple-500 to-violet-500 p-4 rounded-2xl shadow-2xl max-w-xs"
        initial={{ opacity: 0, y: 50, rotate: -8 }}
        animate={{ opacity: 1, y: 0, rotate: -8 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <h3 className="text-white font-bold text-lg mb-2">⚡ Real-time Chat</h3>
        <p className="text-white/90 text-sm">Start conversations instantly and bring your ideas to life together</p>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <motion.div 
          className="text-center max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Logo/Title */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <h1 className="text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                DevTinder
              </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </motion.div>

          {/* Subtitle */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h2 className="text-3xl font-semibold text-white mb-4">
              The creative way to connect.
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Swipe, match, and code with developers who complement your skills. 
              Build the future together, one connection at a time.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <SignUpButton 
              mode="modal"
              fallbackRedirectUrl="/feed"
              signUpFallbackRedirectUrl="/feed"
            >
              <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105">
                <span className="relative z-10">🚀 Start Coding</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </SignUpButton>

            <SignInButton 
              mode="modal"
              fallbackRedirectUrl="/feed"
              signInFallbackRedirectUrl="/feed"
            >
              <button className="px-8 py-4 border-2 border-white/30 text-white text-lg font-semibold rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm">
                Sign In
              </button>
            </SignInButton>
          </motion.div>

          {/* Features */}
          <motion.div 
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
      <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-2000"></div>
    </div>
  );
};

export default LandingPage; 