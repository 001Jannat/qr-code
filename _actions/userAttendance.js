"use server";

import Attendance from "@/models/attendanceModel";
import connectDB from "@/app/providers/database";

export async function userAttendance({ userId, fullName, trainingId }) {
  await connectDB();

  try {
    const attendance = await Attendance.create({
      userId,
      fullName,
      trainingId,
    });


    const userAttendance = attendance.toObject();

    const simplifiedAttendance = {
      ...userAttendance,
      _id: userAttendance._id.toString(), 
      __v: undefined,
      createdAt: undefined,
    };

    console.log("Attendance created successfully:", simplifiedAttendance);
    return {
      success: true,
      message: "Attendance created successfully",
      data: simplifiedAttendance, 
    };
  } catch (error) {
    console.error("Error creating attendance:", error);
    return {
      success: false,
      message: "Unable to create attendance",
      error: error.message,
    };
  }
}
