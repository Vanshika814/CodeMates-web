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
                const {senderId, text, timestamp} = msg;
                const senderComparison = senderId?._id === userId;
                
                return{
                    FirstName: senderId?.FirstName, 
                    LastName: senderId?.LastName, 
                    text,
                    timestamp, 
                    sender: senderComparison ? "me" : "other",
                    avatar: senderId?.avatar
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

        socket.on("messageReceived", ({FirstName, LastName, text, timestamp, senderId, avatar}) => {
            setMessages((messages) => [...messages, {
                FirstName, 
                LastName: LastName || "",
                text, 
                timestamp,
                sender: senderId === userId ? "me" : "other",
                avatar: avatar
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
        
        // ✅ Remove immediate local state update to prevent duplicates
        // Let the socket handle adding the message via messageReceived event
        
        setNewMessage("");
    }



    // console.log(targetId);
    // Add loading guard before rendering
    if (!userId || !user?.FirstName) {
        return <div>Loading chat...</div>;
    }
  return (
    <Card className='w-auto h-96 mx-16 my-8 flex flex-col'>
        <CardBody className='flex flex-col h-full'>
            <h1>Chat</h1>
            <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-hide">
                {messages.map((msg, index) => {
                    const isMe = msg.sender === "me";
                    return (
                        <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-end gap-2 max-w-xs ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                <Avatar 
                                    src={msg.avatar}
                                    size="sm"
                                    className="flex-shrink-0"
                                />
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-medium text-gray-700">
                                            {msg.FirstName} {msg.LastName}
                                        </span>
                                        <time className="text-xs opacity-50">
                                            {msg.timestamp}
                                        </time>
                                    </div>
                                    <div className={`rounded-lg px-3 py-2 ${
                                        isMe 
                                            ? 'bg-primary text-primary-foreground rounded-br-none' 
                                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                    }`}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex w-full md:flex-nowrap gap-4 mt-auto">
                <Input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyUp={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Enter your message" 
                    type="text" 
                />
                <Button 
                    isIconOnly
                    onPress={handleSendMessage} 
                >
                    <SendIcon />
                </Button>
            </div>
        </CardBody>
    </Card>
  )
};

export default Chat