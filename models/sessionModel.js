// models/Session.js

import {models, model, mongoose} from 'mongoose';

const SessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    default: null,
  },
  loggedIn: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Session = models.session || model('session', SessionSchema);

export default Session;
