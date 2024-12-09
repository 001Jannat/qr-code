"use server"
import User from "@/models/userModel";

export async function getUserDetails() {
    const id = "Zgri0c4TyicD04u5q3Tbc1ozkwL2"; 
    try {
        const user = await User.findOne({ _id: id });
        console.log("user", user);
        return user;
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
}
