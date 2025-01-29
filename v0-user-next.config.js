/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyBsYu4xnqaQJ5u55jJOAmgJX6af5Hz6AAQ",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "academy-da6b1.firebaseapp.com",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: "academy-da6b1",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "academy-da6b1.firebasestorage.app",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "961317198039",
    NEXT_PUBLIC_FIREBASE_APP_ID: "1:961317198039:web:e89108b8e00bfe3f8cf892",
  },
}

module.exports = nextConfig

