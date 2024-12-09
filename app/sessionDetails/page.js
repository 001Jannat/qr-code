'use client';

import React, { useEffect,useState } from 'react';
import { getUserDetails } from '@/_actions/userDetails';

export default function SessionDetailPage({ sessionDetails }) {
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                await getUserDetails();
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
        </div>
    );
}
