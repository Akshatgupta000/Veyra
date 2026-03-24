import mongoose from 'mongoose';
import User from './server/models/User.model.js';
import axios from 'axios';
import 'dotenv/config';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  validateStatus: () => true 
});

async function runTests() {
  try {
    console.log("Checking DB Connection locally to read OTP...");
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/veyra_ecommerce");
    
    const email = `test_${Date.now()}@example.com`;
    console.log("\n--- TEST: Registration ---");
    let res = await api.post('/auth/register', {
      name: "Test User", email, password: "password123"
    });
    console.log("Register Response:", res.data);
    
    const cookies = res.headers['set-cookie'];
    const cookieHeader = cookies ? cookies.join('; ') : '';

    console.log("\n--- DB: Fetching OTP ---");
    const user = await User.findOne({ email });
    console.log("OTP found in DB:", user?.otp);

    console.log("\n--- TEST: Verify OTP ---");
    res = await api.post('/auth/verify-otp', { otp: user?.otp }, {
      headers: { Cookie: cookieHeader }
    });
    console.log("Verify Response:", res.data);

    let authCookies = res.headers['set-cookie'] ? res.headers['set-cookie'].join('; ') : '';

    console.log("\n--- TEST: Login ---");
    res = await api.post('/auth/login', {
      email, password: "password123"
    }, { headers: { Cookie: authCookies } });
    console.log("Login Response:", res.data);

    console.log("\n--- TEST: Profile (me) ---");
    authCookies = res.headers['set-cookie'] ? res.headers['set-cookie'].join('; ') : authCookies;
    res = await api.get('/auth/me', { headers: { Cookie: authCookies } });
    console.log("Me Response:", res.data);

    console.log("\nAll tests passed successfully!");
  } catch (error) {
    console.error("Test Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

runTests();
