'use client';

import React from 'react';

export default function SessionDetailPage({ sessionDetails }) {
    return (
        <div>
            <h2>Session Details</h2>
            <p>Session ID: {sessionDetails.sessionId}</p>
            <p>User ID: {sessionDetails.userId}</p>
            <p>Status: Logged In</p>
        </div>
    );
}
