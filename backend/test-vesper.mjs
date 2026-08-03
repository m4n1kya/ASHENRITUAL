// Full E2E Vesper test - show raw bytes
const loginRes = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@ashenritual.com', password: 'admin123' })
});
const loginData = await loginRes.json();
const token = loginData.accessToken;
if (!token) { console.log('No token:', JSON.stringify(loginData)); process.exit(1); }
console.log('Token OK. Calling Vesper...\n');

const vesperRes = await fetch('http://localhost:3001/api/vesper/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ messages: [{ role: 'user', content: 'hi' }], context: {} })
});

console.log('Status:', vesperRes.status);
console.log('Headers:', Object.fromEntries(vesperRes.headers.entries()));

const reader = vesperRes.body.getReader();
const decoder = new TextDecoder();
let full = '';
let chunkNum = 0;
while (true) {
  const { done, value } = await reader.read();
  if (done) { console.log('\n--- STREAM DONE ---'); break; }
  chunkNum++;
  const chunk = decoder.decode(value, { stream: true });
  full += chunk;
  console.log(`\n=== CHUNK ${chunkNum} (${chunk.length} bytes) ===`);
  console.log(JSON.stringify(chunk));
}
console.log('\nTotal response length:', full.length, 'chars');
console.log('\nFull response:\n', full);
