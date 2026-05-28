require('dotenv').config({ path: '.env.local' });
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Split the JWT into parts
const parts = supabaseAnonKey.split('.');
if (parts.length !== 3) {
  console.error('Invalid JWT format');
  process.exit(1);
}

// Decode the payload (second part)
const payload = parts[1];
// Replace URL-safe characters
const decodedPayload = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
console.log('Decoded payload:', decodedPayload);

try {
  const parsed = JSON.parse(decodedPayload);
  console.log('Parsed payload:', JSON.stringify(parsed, null, 2));
  // Check for typical Supabase anon key claims
  console.log('Role:', parsed.role);
  console.log('Audience (should be project ID):', parsed.aud);
} catch (e) {
  console.error('Failed to parse payload as JSON:', e.message);
}