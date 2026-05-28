require('dotenv').config({ path: '.env.local' });
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Key length:', supabaseAnonKey.length);
console.log('First 10 chars:', supabaseAnonKey.slice(0, 10));
console.log('Last 10 chars:', supabaseAnonKey.slice(-10));

// Check for whitespace or newline at the end
if (supabaseAnonKey.endsWith('\n') || supabaseAnonKey.endsWith(' ') || supabaseAnonKey.endsWith('\r')) {
  console.log('WARNING: Key ends with whitespace');
}

// Check for any non-printable ASCII characters (except for the standard JWT characters)
const nonPrintable = supabaseAnonKey.split('').filter(c => c.charCodeAt(0) < 32 || c.charCodeAt(0) > 126);
if (nonPrintable.length > 0) {
  console.log('WARNING: Key contains non-printable characters:', nonPrintable.map(c => c.charCodeAt(0)));
} else {
  console.log('Key contains only printable ASCII characters.');
}

// Try to split by dot and check each part
const parts = supabaseAnonKey.split('.');
if (parts.length === 3) {
  console.log('Key has 3 parts (JWT)');
  parts.forEach((part, index) => {
    console.log(`  Part ${index + 1} length: ${part.length}`);
    // Check if it's valid base64url
    try {
      const buffer = Buffer.from(part, 'base64url');
      console.log(`  Part ${index + 1} is valid base64url`);
    } catch (e) {
      console.log(`  Part ${index + 1} is NOT valid base64url: ${e.message}`);
    }
  });
} else {
  console.log('Key does not have 3 parts, not a standard JWT');
}