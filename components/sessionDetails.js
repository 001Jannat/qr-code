"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  StreamVideo,
  Call,
  StreamTheme,
  StreamCall,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { getUserDetails } from "@/_actions/userDetails";
import { setUserDetails } from "@/store/userSlice";
import { generateToken } from "@/_actions/stream.actions";
import { updateMeeting } from "@/_actions/updateMeeting";
import { getmeetingLink } from "@/_actions/findMeetingId";
import { userAttendance } from "@/_actions/userAttendance";
import MeetingRoom from "./meetingRoom";
import MeetingSetup from "./meetingSetup";
import CustomLoader from "./loader";
 
const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
 
const generateRandomSessionId = () => {
  return `session_${Math.random().toString(36).substring(2, 15)}`;
};
 
const SessionDetailPage = ({ sessionDetails }) => {
  const [call, setCall] = useState(null);
  const [client, setClient] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [devicesOff, setDevicesOff] = useState(true);
  const [sessionId, setSessionId] = useState(
    sessionDetails?.sessionId || generateRandomSessionId()
  );
  const [meetingLink, setMeetingLink] = useState(null);
  const [waitingForMeeting, setWaitingForMeeting] = useState(false);
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state?.user?.userDetails);
 
  useEffect(() => {
    const fetchMeetingLink = async () => {
      try {
        const link = await getmeetingLink(sessionDetails?.trainingId);
        setMeetingLink(link);
      } catch (error) {
        console.error("Error fetching meeting link:", error);
      }
    };
 
    const fetchUserDetails = async () => {
      try {
        const user = await getUserDetails(sessionDetails.userId);
        const updatedUser = {
          ...user,
          createdAt:
            user.createdAt instanceof Date
              ? user.createdAt.toISOString()
              : user.createdAt,
        };
        setUserDetails(updatedUser);
        dispatch(setUserDetails(updatedUser));
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
 
    fetchUserDetails();
    fetchMeetingLink();
  }, [sessionDetails?.userId, sessionDetails?.trainingId, dispatch]);
 
  useEffect(() => {
    let interval;
 
    if (!meetingLink) {
      interval = setInterval(async () => {
        try {
          const link = await getmeetingLink(sessionDetails?.trainingId);
          if (link) {
            setMeetingLink(link);
            clearInterval(interval);
            handleJoinMeetingClick();
          }
        } catch (error) {
          console.error("Error fetching meeting link:", error);
        }
      }, 2000);
    }
 
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [meetingLink, sessionDetails?.trainingId]);
 
  const handleMeetingClick = async () => {
    console.log("Joining meeting with devices:", devicesOff ? "off" : "on");
    if (!API_KEY) {
      console.error("Stream API key is missing.");
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
 
      const meetingId = `${sessionDetails?.trainingId}_${Math.random()
        .toString(36)
        .substring(2, 15)}`;
      const videoCall = videoClient.call("default", meetingId);
      await videoCall.join({ create: true });
 
      setCall(videoCall);
      setClient(videoClient);
      setShowDetails(false);
      setMeetingLink(meetingId);
 
      const updatetrainings = await updateMeeting(
        sessionDetails?.trainingId,
        meetingId
      );
      if (updatetrainings) {
        console.log("Meeting link updated successfully:", updatetrainings);
      } else {
        console.error("Failed to update the meeting link.");
      }
    } catch (error) {
      console.error("Error initializing the video call:", error);
    }
  };
 
  const handleJoinMeetingClick = async () => {
    console.log("Joining meeting with devices:", devicesOff ? "off" : "on");
    if (!meetingLink) {
      console.error("Meeting link is still missing.");
      setWaitingForMeeting(false);
      return;
    }
    setShowDetails(false);
    setWaitingForMeeting(true);
 
    try {
      const attendanceResponse = await userAttendance({
        userId: userDetails?._id,
        fullName: userDetails?.fullName,
        trainingId: sessionDetails?.trainingId,
      });
      if (!attendanceResponse.success) {
        console.error(
          "Failed to record attendance:",
          attendanceResponse.message
        );
        setWaitingForMeeting(false);
        return;
      }
 
      const token = await generateToken(userDetails?._id);
      const videoClient = new StreamVideoClient({
        apiKey: API_KEY,
        user: {
          id: userDetails?._id,
          name: userDetails?.fullName,
        },
        token,
      });
 
      const videoCall = videoClient.call("default", meetingLink);
      await videoCall.join();
      setCall(videoCall);
      setClient(videoClient);
 
      setWaitingForMeeting(false);
    } catch (error) {
      console.error("Error joining the meeting:", error);
      setWaitingForMeeting(false);
    }
  };
 
  if (!userDetails) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{
          background: "linear-gradient(135deg, white, #0ab39c)",
        }}
      >
        <CustomLoader />
      </div>
    );
  }
 
  return (
    <div
      className="h-screen"
      style={{
        background: "linear-gradient(135deg, white, #0ab39c)",
      }}
    >
      {showDetails && (
        <MeetingSetup
          userDetails={userDetails}
          meetingLink={meetingLink}
          handleJoinMeetingClick={handleJoinMeetingClick}
          handleMeetingClick={handleMeetingClick}
          buttonColor="#0ab39c"
        />
      )}
 
      {waitingForMeeting && (
        <div
          className="flex flex-col justify-center items-center h-screen text-black"
          style={{
            background: "linear-gradient(135deg, white, #0ab39c)",
          }}
        >
          <CustomLoader />
          <p className="mt-4">
            Waiting for the meeting to start. Please wait...
          </p>
        </div>
      )}
 
      {call && client && (
        <StreamVideo client={client}>
          <StreamTheme>
            <StreamCall call={call}>
              <MeetingRoom />
            </StreamCall>
          </StreamTheme>
        </StreamVideo>
      )}
    </div>
  );
};
 
export default SessionDetailPage;