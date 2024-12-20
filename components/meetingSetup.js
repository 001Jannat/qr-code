"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Video, VideoOff, Mic, MicOff, Users } from 'lucide-react';
import { StreamVideo, StreamVideoProvider, StreamVideoClient } from '@stream-io/video-react-sdk';
import { useDispatch, useSelector } from 'react-redux';
import { generateToken } from '@/_actions/stream.actions';
import { updateMeeting } from '@/_actions/updateMeeting';
import { getmeetingLink } from '@/_actions/findMeetingId';
import { userAttendance } from '@/_actions/userAttendance';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const MeetingSetup = ({ userDetails, meetingLink, handleJoinMeetingClick, handleMeetingClick }) => {
    const [call, setCall] = useState(null);
    const [client, setClient] = useState(null);
    const [devicesOff, setDevicesOff] = useState(true);
    const [waitingForMeeting, setWaitingForMeeting] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);
    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchMeetingLink = async () => {
            try {
                const link = await getmeetingLink(userDetails.trainingId);
                setMeetingLink(link);
            } catch (error) {
                console.error('Error fetching meeting link:', error);
            }
        };

        if (!meetingLink) {
            fetchMeetingLink();
        }
    }, [meetingLink, userDetails.trainingId]);

    const toggleCamera = () => {
        setIsCameraOn((prev) => !prev);
    };

    const toggleMic = () => {
        setIsMicOn((prev) => !prev);
    };

    const allowDevices = () => {
        setIsCameraOn(true);
        setIsMicOn(true);
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

    const handleJoinMeetingDirectly = () => {
        handleJoinMeetingClick();
    };

    return (
        <StreamVideoProvider>
            <div className="min-h-screen bg-[#202124]">



                <div className="flex h-[calc(100vh-64px)]">

                    <div className="flex-1 bg-[#202124] p-8">
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
                            <h2 className="text-2xl text-white text-center mb-4">
                                Do you want people to see and hear you in the meeting?
                            </h2>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={allowDevices}
                                    className="px-6 py-3 bg-[#1a73e8] text-white rounded-md hover:bg-[#1557b0] transition-colors"
                                >
                                    Allow microphone and camera
                                </button>
                                {userDetails?.admin === 'true' && (
                                    <button
                                        onClick={handleJoinMeetingDirectly}
                                        className="px-6 py-3 bg-[#1a73e8] text-white rounded-md hover:bg-[#1557b0] transition-colors"
                                    >
                                        Join Meeting
                                    </button>
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

