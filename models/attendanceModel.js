import { models, model, mongoose } from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: null,
  },
  fullName: {
    type: String,
    default: null, 
  },
  trainingId: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Attendance = models.attendance || model('attendance', AttendanceSchema);

export default Attendance;
