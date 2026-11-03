import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const testAuth = async () => {
  const rawClientId = process.env.SHYPFY_CLIENT_ID?.trim();
  const username = process.env.SHYPFY_EMAIL?.trim();
  const password = process.env.SHYPFY_PASSWORD?.trim();

  console.log("Testing credentials...");
  console.log("Username:", username);
  console.log("Password length:", password?.length);
  console.log("Raw Client ID:", rawClientId);

  const clientIdsToTest = [
    rawClientId,
    rawClientId?.toLowerCase(),
    rawClientId?.replace("SHYPFY_", ""),
    rawClientId?.replace("SHYPFY_", "").toLowerCase()
  ];

  for (const id of clientIdsToTest) {
    if (!id) continue;
    const url = `https://app.shypfy.com/integrations/v2/auth/token/${id}`;
    console.log(`\nTrying URL: ${url}`);

    try {
      const res = await axios.post(url, { username, password });
      console.log("✅ SUCCESS! Token received:", res.data);
      return;
    } catch (err) {
      console.log(`❌ FAILED (${id}):`, err.response?.data?.message || err.message);
    }
  }
};

testAuth();