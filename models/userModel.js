import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    fullName: { type: String, required: true },
  
});

const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');

export default User;
