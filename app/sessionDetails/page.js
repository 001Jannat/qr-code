'use client';
 
import React, { useEffect, useState } from 'react';
import { getUserDetails } from '@/_actions/userDetails';
 
export default function SessionDetailPage({ sessionDetails }) {
    const [userDetails, setUserDetails] = useState(null); 
 
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
    }, []);
 
    return (
        <div>
            <h2>Session Details</h2>
            <p>Session ID: {sessionDetails.sessionId}</p>
            <p>User ID: {sessionDetails.userId}</p>
            <p>Status: Logged In</p>
 
            {/* Conditionally render user details */}
            {userDetails ? (
                <div>
                    <h3>User Details</h3>
                    <p><strong>Full Name:</strong> {userDetails.fullName}</p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>Phone Number:</strong> {userDetails.phoneNumber}</p>
                    {/* <p><strong>City:</strong> {userDetails.city}</p>
                    <p><strong>Date of Birth:</strong> {userDetails.DOB}</p>
                    <p><strong>Gender:</strong> {userDetails.Gender}</p>
                    <p><strong>Created At:</strong> {new Date(userDetails.createdAt).toLocaleDateString()}</p> */}
 
                    <h4>Competitions:</h4>
                    {userDetails.competitions.length > 0 ? (
                        <ul>
                            {userDetails.competitions.map((competition, index) => (
                                <li key={index}>Competition {index + 1}: {JSON.stringify(competition.submit)}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No competitions found.</p>
                    )}
                </div>
            ) : (
                <p>Loading user details...</p>
            )}
        </div>
    );
}
 