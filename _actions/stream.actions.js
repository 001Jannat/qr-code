'use server';

import { StreamClient } from '@stream-io/node-sdk';

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.NEXT_PUBLIC_STREAM_SECRET_KEY;

if (!STREAM_API_KEY || !STREAM_API_SECRET) {
  throw new Error('Stream API keys are missing. Please check environment variables.');
}

export const generateToken = async (id) => {
    console.log('Generating token for user:', id);
  if (!id) throw new Error('User ID is required to generate a token.');

  try {
    const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);
    if (!streamClient) throw new Error('Failed to initialize StreamClient.');

    const iat = Math.floor(Date.now() / 1000) - 300;

    const token = streamClient.generateUserToken({
      user_id: id,
      iat,
      validity_in_seconds: 3600,
    });
    console.log('Generated token:', token);
    return token;
  } catch (error) {
    console.error('Error generating Stream token:', error);
    throw new Error('Token generation failed.');
  }
};
