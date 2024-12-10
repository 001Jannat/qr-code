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

const SessionDetailPage = ({ sessionDetails }) => {
  const [call, setCall] = useState(null);
  const [client, setClient] = useState(null);
  const [showDetails, setShowDetails] = useState(true);

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

      const videoClient = new StreamVideoClient({
        apiKey: API_KEY,
        user: {
          id: userDetails?._id,
          name: userDetails?.fullName,
        },
        token,
      });

      const videoCall = videoClient.call('default', sessionDetails.sessionId);
      await videoCall.join({ create: true });
      setCall(videoCall);
      setClient(videoClient);
      setShowDetails(false);
    } catch (error) {
      console.error('Error initializing the video call:', error);
    }
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
          <p><strong>Email:</strong> {userDetails?.email}</p>
          <p><strong>Phone Number:</strong> {userDetails?.phoneNumber}</p>

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
};

export default SessionDetailPage;
