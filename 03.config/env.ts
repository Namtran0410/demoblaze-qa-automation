import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '.env'), quiet: true });

export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://www.demoblaze.com',
  apiUrl: process.env.API_URL ?? 'https://api.demoblaze.com',
  isCI: !!process.env.CI,
};
