"use server";
 
import mongoose from "mongoose";
import connectDB from "@/app/providers/database";
 
export async function updateMeeting(trainingId,meetingLink) {
 
    try {
        const Training = await mongoose.connection.db
            .collection("trainings")
            .findOneAndUpdate(
                { _id: trainingId },
                { $set: { meetingLink: meetingLink } },
                { returnOriginal: 'after' }
            );
 
        console.log("updateing training......", Training);
        return Training;
    } catch (error) {
        console.error("Error fetching training details:", error);
        return null;
    }
}
 