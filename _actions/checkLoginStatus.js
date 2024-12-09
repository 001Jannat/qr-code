'use server'

import Session from "@/models/sessionModel";
import connectDB from "@/app/database";

export async function checkLoginStatus(sessionId) {
    await connectDB();

    try {
      
        const session = await Session.findOne({ sessionId });

        if (!session) {
            throw new Error('Session not found');
        }

        if (session.loggedIn) {
            return {
                sessionId: session.sessionId,
                userId: session.userId,
                loggedIn: session.loggedIn,
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error checking login status:", error);
        throw new Error("Unable to check login status");
    }
}
