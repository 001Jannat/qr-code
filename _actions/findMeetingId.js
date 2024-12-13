"use server";

import mongoose from "mongoose";
import connectDB from "@/app/providers/database";

export async function getmeetingLink(trainingId) {
    try {
        const training = await mongoose.connection.db
            .collection("trainings")
            .findOne(
                { _id: trainingId },
                { projection: { meetingLink: 1 } } 
            );

        if (training) {
            return training.meetingLink;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching training details:", error);
        return null;
    }
}
 