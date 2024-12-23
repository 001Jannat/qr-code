"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Video, VideoOff, Mic, MicOff, Users } from 'lucide-react';
import { StreamVideo, StreamVideoProvider, StreamVideoClient } from '@stream-io/video-react-sdk';
import { useDispatch, useSelector } from 'react-redux';

import CustomLoader from './loader';

const MeetingSetup = ({ userDetails, meetingLink, handleJoinMeetingClick, handleMeetingClick }) => {

    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);
    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const dispatch = useDispatch();

    // if (!meetingLink) {
    //   return <CustomLoader /> 
    // }

    const toggleCamera = () => {
        setIsCameraOn((prev) => !prev);
    };

    const toggleMic = () => {
        setIsMicOn((prev) => !prev);
    };

    const allowDevices = (event) => {
        const isChecked = event.target.checked;
        setIsCameraOn(isChecked);
        setIsMicOn(isChecked);
    };

    useEffect(() => {
        if (isCameraOn) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch((error) => {
                    console.error('Error accessing camera:', error);
                });
        } else {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        }
    }, [isCameraOn]);

    useEffect(() => {
        if (isMicOn) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    if (audioRef.current) {
                        audioRef.current.srcObject = stream;
                    }
                })
                .catch((error) => {
                    console.error('Error accessing microphone:', error);
                });
        } else {
            if (audioRef.current && audioRef.current.srcObject) {
                const stream = audioRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                audioRef.current.srcObject = null;
            }
        }
    }, [isMicOn]);

    return (
        <StreamVideoProvider>
            <div className="min-h-screen bg-gradient-to-r from-white to-[#0ab39c]">
                <div className="w-full from-white to-[#0ab39c] p-3 flex items-center">
                    <img
                        src="/logo.png"
                        alt="Favicon"
                        className="w-9 h-9 mr-3"
                    />
                    <h1
                        className="text-3xl font-bold flex-1 text-pretty"
                        style={{
                            background: "linear-gradient(to right, #0ab39c, rgb(78, 143, 248), red, yellow, green)",
                            WebkitBackgroundClip: "text",
                            color: "transparent",
                            display: "inline-block",
                        }}
                    >
                        Excelrs
                    </h1>
                </div>
                <div className="flex h-[calc(100vh-64px)]">
                    <div className="flex-1 bg-gradient-to-r from-white to-[#0ab39c] p-8">
                        <div className="max-w-4xl mx-auto h-full flex flex-col">
                            <div className="relative flex-1 rounded-lg overflow-hidden bg-black/50 mb-8">
                                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted />
                                <audio ref={audioRef} autoPlay />
                                <div className="absolute top-4 right-4">
                                    <button className="p-2 rounded-full bg-gray-800/50 text-white hover:bg-gray-800">
                                        <MoreVertical className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    <button
                                        onClick={toggleMic}
                                        className="p-3 rounded-full bg-[#3c4043] text-white hover:bg-[#3c4043]/80"
                                    >
                                        {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                                    </button>
                                    <button
                                        onClick={toggleCamera}
                                        className="p-3 rounded-full bg-[#3c4043] text-white hover:bg-[#3c4043]/80"
                                    >
                                        {isCameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                                    </button>
                                </div>
                            </div>
                            <h2 className="text-2xl text-white text-center mb-4 font-bold">
                                Do you want people to see and hear you in the meeting?
                            </h2>
                            <div className="flex justify-center gap-4 items-center">
                                <input
                                    type="checkbox"
                                    id="allowDevices"
                                    checked={isCameraOn && isMicOn} // Ensures both mic and camera are allowed
                                    onChange={allowDevices} // Calls the function to toggle both mic and camera
                                    className="mr-2"
                                />
                                <label htmlFor="allowDevices" className="text-white text-xl font-bold">
                                    Allow microphone and camera
                                </label>
                            </div>
                            <div className="flex justify-center items-center mt-5">
                                {meetingLink ? (
                                    <button
                                        onClick={handleJoinMeetingClick}
                                        className="bg-green-500 text-white py-2 px-6 rounded-md cursor-pointer"
                                    >
                                        Join Meeting
                                    </button>
                                ) : userDetails?.admin === 'true' ? (
                                    <button
                                        onClick={handleMeetingClick}
                                        className="bg-blue-500 text-white py-2 px-6 rounded-md cursor-pointer"
                                    >
                                        Create Meeting
                                    </button>
                                ) : (
                                    <div className="text-black">Waiting for the admin to create the meeting...</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StreamVideoProvider>
    );
};

export default MeetingSetup;
