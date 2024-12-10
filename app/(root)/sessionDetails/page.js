'use client';
import React, { useState, useEffect } from 'react';
import { getUserDetails } from '@/_actions/userDetails';
import { StreamVideo, StreamTheme, StreamCall, SpeakerLayout, CallControls, StreamVideoClient } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

export default function SessionDetailPage({ sessionDetails }) {
    const [userDetails, setUserDetails] = useState(null);
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const [showDetails, setShowDetails] = useState(true); 

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const user = await getUserDetails(sessionDetails.userId);
                setUserDetails(user);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        fetchUserDetails();
    }, [sessionDetails]);

    const handleMeetingClick = async () => {
        setShowDetails(false); 
        const apiKey = "mmhfdzb5evj2";
        const user_id = sessionDetails.userId;
        const tokenProvider = async () => {
            const { token } = await fetch(
                `https://pronto.getstream.io/api/auth/create-token?api_key=${apiKey}&user_id=${user_id}`
            ).then((res) => res.json());
            return token;
        };

        const myClient = new StreamVideoClient({ apiKey, user: { id: user_id ,name:userDetails?.fullName}, tokenProvider });
        setClient(myClient);

        const myCall = myClient.call("default", sessionDetails.sessionId);
        await myCall.join({ create: true });
        setCall(myCall);
    };

    if (!userDetails) return <p>Loading user details...</p>;

    return (
        <div>
            {showDetails && (
                <div>
                    <h2>Session Details</h2>
                    <p>Session ID: {sessionDetails.sessionId}</p>
                    <p>User ID: {sessionDetails.userId}</p>
                    <p>Status: Logged In</p>

                    <h3>User Details</h3>
                    <p><strong>Full Name:</strong> {userDetails?.fullName}</p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>Phone Number:</strong> {userDetails.phoneNumber}</p>

                    <button
                        onClick={handleMeetingClick}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Start Meeting
                    </button>
                </div>
            )}

            {call && client && (
                <StreamVideo client={client}>
                    <StreamTheme>
                        <StreamCall call={call}>
                            <SpeakerLayout />
                            <CallControls />
                        </StreamCall>
                    </StreamTheme>
                </StreamVideo>
            )}
        </div>
    );
}
