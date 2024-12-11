'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  StreamVideo,
  StreamTheme,
  StreamCall,
  SpeakerLayout,
  CallControls,
  StreamVideoClient,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { getUserDetails } from '@/_actions/userDetails';
import { setUserDetails } from '@/store/userSlice';
import { generateToken } from '@/_actions/stream.actions';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const generateRandomSessionId = () => {
  return `session_${Math.random().toString(36).substring(2, 15)}`;
};

const SessionDetailPage = ({ sessionDetails }) => {
  const [call, setCall] = useState(null);
  const [client, setClient] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [sessionId, setSessionId] = useState(sessionDetails?.sessionId || generateRandomSessionId());
  console.log("sessionDetails", sessionDetails);
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state?.user?.userDetails);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = await getUserDetails(sessionDetails.userId);
        const updatedUser = {
          ...user,
          createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
        };
        setUserDetails(updatedUser);
        dispatch(setUserDetails(updatedUser));
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, [sessionDetails.userId, dispatch]);

  const handleMeetingClick = async () => {
    if (!API_KEY) {
      console.error('Stream API key is missing.');
      return;
    }

    try {
      const token = await generateToken(userDetails?._id);
 console.log("token", token);
      const videoClient = new StreamVideoClient({
        apiKey: API_KEY,
        user: {
          id: userDetails?._id,
          name: userDetails?.fullName,
        },
        token,
      });

      const videoCall = videoClient.call('default', sessionId);
      await videoCall.join({ create: true });
      setCall(videoCall);
      setClient(videoClient);
      setShowDetails(false);
    } catch (error) {
      console.error('Error initializing the video call:', error);
    }
  };

  const handleJoinMeetingClick = async () => {
   console.log("joinig meeting");
  };

  if (!userDetails) return <p>Loading user details...</p>;

  return (
    <div>
      {showDetails && (
        <div>
          <h2>Session Details</h2>
          <p>Session ID: {sessionId}</p>
          <p>User ID: {sessionDetails.userId}</p>
          <p>Training ID: {sessionDetails?.trainingId}</p>
          <p>Status: Logged In</p>

          <h3>User Details</h3>
          <p><strong>Full Name:</strong> {userDetails?.fullName}</p>
          <p><strong>Email:</strong> {userDetails?.email}</p>
          <p><strong>Phone Number:</strong> {userDetails?.phoneNumber}</p>

          {userDetails?.admin == 'true' ? (
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
              create Meeting
            </button>
          ) : (
            <button
              onClick={handleJoinMeetingClick}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Join Meeting
            </button>
          )}
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
};

export default SessionDetailPage;
