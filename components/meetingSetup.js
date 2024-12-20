import React from 'react';

const MeetingSetup = ({ userDetails, meetingLink, handleJoinMeetingClick, handleMeetingClick }) => {
    return (
        <>
            <div className="w-4/5 h-[500px] mx-auto border border-gray-300 mt-10 flex flex-col justify-center items-center text-center rounded-md">
                <h3 className="text-xl font-bold mb-5">{userDetails?.fullName}</h3>
            </div>

            {meetingLink ? (
                <div className="flex justify-center items-center mt-5">
                    <button
                        onClick={handleJoinMeetingClick}
                        className="bg-green-500 text-white py-2 px-6 rounded-md cursor-pointer"
                    >
                        Join Meeting
                    </button>
                </div>
            ) : userDetails?.admin === 'true' ? (
                <div className="flex justify-center items-center mt-5">
                    <button
                        onClick={handleMeetingClick}
                        className="bg-blue-500 text-white py-2 px-6 rounded-md cursor-pointer"
                    >
                        Create Meeting
                    </button>
                </div>
            ) : (
                <div className="flex justify-center items-center mt-5">
                    Waiting for the admin to create the meeting...
                </div>
            )}
        </>
    );
};

export default MeetingSetup;
