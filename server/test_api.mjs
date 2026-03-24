import mongoose from 'mongoose';
import User from './models/User.model.js';
import 'dotenv/config';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  try {
    console.log("Checking DB Connection locally to read OTP...");
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/veyra_ecommerce");
    
    const email = `test_${Date.now()}@example.com`;
    console.log("\n--- TEST: Registration ---");
    let response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: "Test User", email, password: "password123" })
    });
    let data = await response.json();
    console.log("Register Response:", data);
    
    let cookies = response.headers.get('set-cookie') || '';
    let cookieHeader = Array.isArray(cookies) ? cookies.join('; ') : cookies;

    console.log("\n--- DB: Fetching OTP ---");
    const user = await User.findOne({ email });
    console.log("OTP found in DB:", user?.otp);

    console.log("\n--- TEST: Verify OTP ---");
    response = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader },
      body: JSON.stringify({ otp: user?.otp })
    });
    data = await response.json();
    console.log("Verify Response:", data);

    cookies = response.headers.get('set-cookie') || '';
    let authCookies = Array.isArray(cookies) ? cookies.join('; ') : cookies;

    console.log("\n--- TEST: Login ---");
    response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': authCookies },
      body: JSON.stringify({ email, password: "password123" })
    });
    data = await response.json();
    console.log("Login Response:", data);

    cookies = response.headers.get('set-cookie') || '';
    authCookies = cookies ? (Array.isArray(cookies) ? cookies.join('; ') : cookies) : authCookies;

    console.log("\n--- TEST: Profile (me) ---");
    response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: { 'Cookie': authCookies }
    });
    data = await response.json();
    console.log("Me Response:", data);

    console.log("\nAll tests passed successfully!");
  } catch (error) {
    console.error("Test Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

runTests();
