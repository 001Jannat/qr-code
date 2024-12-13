"use server";
 
import mongoose from "mongoose";
import connectDB from "@/app/providers/database";
 
export async function getUserDetails(id) {
    // const id = "Zgri0c4TyicD04u5q3Tbc1ozkwL2";
 
    try {
        const user = await mongoose.connection.db
            .collection("users")
            .findOne({ _id: id });
 
        console.log("user", user);
        return user;
    } catch (error) {
        console.error("Error fetching user details:", error);
        return null;
    }
}
 