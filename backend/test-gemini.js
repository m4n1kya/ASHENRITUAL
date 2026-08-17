const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.log("No GEMINI_API_KEY found in .env");
  process.exit(1);
}

async function testGemini() {
  const url = new URL('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:streamGenerateContent');
  url.searchParams.append('alt', 'sse');
  url.searchParams.append('key', apiKey);

  console.log("Testing with key:", apiKey.substring(0, 5) + "...");

  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Error: ${response.status} ${errorText}`);
    } else {
      console.log("Success! Status:", response.status);
    }
  } catch (err) {
    console.log("Fetch failed:", err);
  }
}

testGemini();
