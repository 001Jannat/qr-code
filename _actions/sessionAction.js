'use server'
//sessionAction.js
import Session from "@/models/sessionModel"
import { v4 as uuidv4 } from 'uuid';
import connectDB from "@/app/database";

export async function getSession() {
    await connectDB();

    try {
        const sessionId = uuidv4(); 
        const session = await Session.create({ sessionId, loggedIn: false });
        return session.sessionId;
        console.log(sessionId);
    } catch (error) {
        console.error("Error creating session:", error);
        throw new Error("Unable to create session");
    }
}
