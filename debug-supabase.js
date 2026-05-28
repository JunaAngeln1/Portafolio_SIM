require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Environment Variables:');
console.log('- SUPABASE_URL:', supabaseUrl ? '(SET)' : '(MISSING)');
console.log('- SUPABASE_ANON_KEY:', supabaseAnonKey ? `(SET, length: ${supabaseAnonKey.length})` : '(MISSING)');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test 1: Try to connect by making a simple request
console.log('\n=== Test 1: Basic Connection ===');
supabase.from('clinics').select('count', { head: true }).then(({ data, error }) => {
  if (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error('   Details:', error);
  } else {
    console.log('✅ Connection successful!');
    console.log('   Clinics count:', data);
  }
  
  // Test 2: Try to query a non-existent table to see if we get a different error
  console.log('\n=== Test 2: Non-existent table ===');
  supabase.from('nonexistent_table').select('*').limit(1).then(({ data, error }) => {
    if (error) {
      console.log('Response for nonexistent table:');
      console.log('   Error:', error.message);
      console.log('   Status:', error.status);
      console.log('   Hint:', error.hint);
    } else {
      console.log('   Unexpected success:', data);
    }
    
    // Test 3: Try to access Supabase REST API directly with fetch
    console.log('\n=== Test 3: Direct REST API call ===');
    const url = `${supabaseUrl}/rest/v1/`;
    fetch(url, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    })
    .then(response => {
      console.log('Direct API response status:', response.status);
      return response.text();
    })
    .then(text => {
      console.log('Direct API response body (first 200 chars):', text.substring(0, 200));
    })
    .catch(err => {
      console.error('Direct API call failed:', err.message);
    });
  });
});