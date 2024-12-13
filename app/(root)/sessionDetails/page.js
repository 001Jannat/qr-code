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
import { updateMeeting } from '@/_actions/updateMeeting';
import { getmeetingLink } from '@/_actions/findMeetingId';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const generateRandomSessionId = () => {
  return `session_${Math.random().toString(36).substring(2, 15)}`;
};

const SessionDetailPage = ({ sessionDetails }) => {
  if (!sessionDetails || !sessionDetails.userId) {
    return <p>Loading session details...</p>;
  }
  
  const [call, setCall] = useState(null);
  const [client, setClient] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [sessionId, setSessionId] = useState(sessionDetails?.sessionId || generateRandomSessionId());
  const [waitingForMeeting, setWaitingForMeeting] = useState(false);
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state?.user?.userDetails);


  useEffect(() => {
    if (!sessionDetails?.userId) {
      console.warn('Session details or userId is undefined. Skipping fetchUserDetails.');
      return;
    }
  
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

  if (!sessionDetails?.userId) {
    return <p>Loading session details...</p>;
  }

  if (!userDetails) {
    return <p>Loading user details...</p>;
  }

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

      const meetingId = `${sessionDetails?.trainingId}_${Math.random().toString(36).substring(2, 15)}`;
      console.log("meetingId", meetingId);
      const videoCall = videoClient.call('default', meetingId);
      await videoCall.join({ create: true });
      setCall(videoCall);
      setClient(videoClient);
      setShowDetails(false);
      console.log('Video call initialized:', videoCall);
      console.log("after calling meeting", meetingId);

      const updatetrainings = await updateMeeting(sessionDetails?.trainingId, meetingId);
      if (updatetrainings) {
        console.log("Meeting link updated successfully:", updatetrainings);
      } else {
        console.error("Failed to update the meeting link.");
      }
    } catch (error) {
      console.error('Error initializing the video call:', error);
    }
  };

  const handleJoinMeetingClick = async () => {
    setWaitingForMeeting(true);

    const fetchMeetingLinkAndJoin = async () => {
      try {
        const meetingLink = await getmeetingLink(sessionDetails?.trainingId);

        if (!meetingLink) {
          console.log('No meeting link available yet. Retrying...');
          setTimeout(fetchMeetingLinkAndJoin, 5000); 
          return;
        }

        console.log("Meeting link fetched:", meetingLink);

        if (!API_KEY) {
          console.error("Stream API key is missing.");
          return;
        }

        const token = await generateToken(userDetails?._id);
        console.log("Token generated:", token);

        const videoClient = new StreamVideoClient({
          apiKey: API_KEY,
          user: {
            id: userDetails?._id,
            name: userDetails?.fullName,
          },
          token,
        });

        const videoCall = videoClient.call('default', meetingLink);
        await videoCall.join();
        setCall(videoCall);
        setClient(videoClient);
        setShowDetails(false);
        setWaitingForMeeting(false);
        console.log("Successfully joined the meeting:", videoCall);
      } catch (error) {
        console.error("Error joining the meeting:", error);
        setTimeout(fetchMeetingLinkAndJoin, 5000); // Retry after 5 seconds on error
      }
    };

    fetchMeetingLinkAndJoin();
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
                insetBlockStart: '20px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Create Meeting
            </button>
          ) : (
            <button
              onClick={handleJoinMeetingClick}
              style={{
                insetBlockStart: '20px',
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

      {waitingForMeeting && (
        <div>
          <p>Waiting for the meeting to start. Please wait...</p>
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
