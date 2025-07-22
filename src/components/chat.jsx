import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import { useParams } from 'react-router'
import { Card, CardBody, Input, Button, Avatar, Chip } from "@heroui/react";
import SendIcon from './icons/SendIcon';
import { createSocketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { BASE_URL } from '../utils/constants';

const Chat = () => {
    const { getToken } = useAuth(); // Get Clerk auth helper
    const {targetId} = useParams();
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const user = useSelector(store => store.user);
    const userId = user?._id;
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchChatMessages = async () => {
        if (!userId) {
            return;
        }
        
        try {
            const token = await getToken();
            const chat = await axios.get(BASE_URL + "/chat/" + targetId, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }, withCredentials: true,
            });

            const chatMessages = chat?.data?.messages?.map(msg => {
                const {senderId, text, createdAt} = msg;
                const senderComparison = senderId?._id === userId;
                
                return{
                    FirstName: senderId?.FirstName, 
                    LastName: senderId?.LastName, 
                    text,
                    timestamp: createdAt, // Use createdAt from MongoDB
                    sender: senderComparison ? "me" : "other",
                    avatar: senderId?.photoUrl || senderId?.avatar
                };
            }) || [];
            
            setMessages(chatMessages);
            
        } catch (error) {
            console.error("Error fetching chat messages:", error);
        }
    };
    

    useEffect(() => {
        if (userId && targetId) {
            fetchChatMessages();
        }
    }, [userId, targetId]);


    useEffect(() => {
        if(!userId || !user?.FirstName){
            return;
        }
        const socket = createSocketConnection(); // as soon as the page loads this object will be called and connection will bet set
        // pass events
        socket.emit("joinChat", {
            FirstName: user.FirstName, 
            userId, 
            targetId
        });

        socket.on("messageReceived", ({FirstName, LastName, text, timestamp, senderId, avatar, photoUrl}) => {
            setMessages((messages) => [...messages, {
                FirstName, 
                LastName: LastName || "",
                text, 
                timestamp: timestamp || new Date().toISOString(), // Fallback to current time
                sender: senderId === userId ? "me" : "other",
                avatar: photoUrl || avatar
            }]);
        });

        return () => {
            socket.disconnect();
        };
    }, [userId, targetId, user?.FirstName])

    const handleSendMessage = () => {
        if (!newMessage.trim()) return; // Don't send empty messages
        
        const socket = createSocketConnection();
        socket.emit("sendMessage", {
            FirstName: user.FirstName,
            userId, 
            targetId, 
            text: newMessage
        });        
        setNewMessage("");
    }
    // Add loading guard before rendering
    if (!userId || !user?.FirstName) {
        return (
          <div className="w-full max-w-4xl mx-auto my-2 md:my-6 h-[70vh] md:h-[600px] bg-gradient-to-br from-purple-50 to-purple-100 lg:rounded-2xl shadow-lg flex items-center justify-center px-4">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-purple-700 font-medium text-sm md:text-base">Loading chat...</p>
            </div>
          </div>
        );
    }
  return (
    <div className="w-full max-w-4xl mx-auto my-2 md:my-6 h-[87vh] md:h-[500px] bg-gradient-to-br from-purple-50 to-purple-100 rounded-none md:rounded-2xl shadow-lg flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="bg-white shadow-sm border-b border-purple-200 px-3 md:px-6 py-3 md:py-4 rounded-t-lg md:rounded-t-2xl">
        <div className="flex items-center gap-2 md:gap-3">
          <Avatar 
            src={messages.length > 0 ? messages.find(msg => msg.sender === "other")?.avatar : ""} 
            size="sm"
            className="md:size-md ring-2 ring-purple-200"
          />
          <div>
            <h1 className="text-lg md:text-xl font-bold text-purple-800">
              {messages.length > 0 
                ? `${messages.find(msg => msg.sender === "other")?.FirstName || ""} ${messages.find(msg => msg.sender === "other")?.LastName || ""}`
                : "Chat"
              }
            </h1>
            <p className="text-xs md:text-sm text-gray-600">Online</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-3 md:py-4 space-y-3 md:space-y-4 bg-gradient-to-b from-white/50 to-purple-50/30 scrollbar-hide">
        {messages.map((msg, index) => {
          const isMe = msg.sender === "me";
          return (
            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3 md:mb-4`}>
              <div className={`flex items-end gap-2 md:gap-3 max-w-[85%] md:max-w-md ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar 
                  src={msg.photoUrl}
                  size="sm"
                  className="flex-shrink-0 ring-2 ring-purple-100 w-6 h-6 md:w-8 md:h-8"
                />
                <div className="flex flex-col">
                  <div className={`flex items-center gap-2 mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <time className="text-xs text-gray-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </time>
                  </div>
                  <div className={`rounded-xl md:rounded-2xl px-3 md:px-4 py-2 md:py-3 shadow-sm ${
                    isMe 
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-br-md' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                  }`}>
                    <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-purple-200 px-3 md:px-6 py-3 md:py-4 shadow-lg rounded-b-lg md:rounded-b-2xl">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex-1 relative">
            <Input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..." 
              type="text"
              variant="bordered"
              size="sm"
              className="w-full md:size-md"
              classNames={{
                input: "bg-gray-50 text-gray-800 text-sm md:text-base",
                inputWrapper: "border-gray-300 hover:border-purple-400 focus-within:border-purple-600 bg-gray-50"
              }}
            />
          </div>
          <Button 
            isIconOnly
            onPress={handleSendMessage}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-md"
            size="md"
          >
            <SendIcon />
          </Button>
        </div>
      </div>
    </div>
  )
};

export default Chat