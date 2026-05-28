require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'MISSING');
console.log('Supabase Key length:', supabaseAnonKey ? supabaseAnonKey.length : 0);
console.log('Supabase Key starts with:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) : 'MISSING');
console.log('Supabase Key ends with:', supabaseAnonKey ? supabaseAnonKey.substring(supabaseAnonKey.length - 20) : 'MISSING');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('Testing connection to Supabase...');
    const { data, error } = await supabase.from('clinics').select('*').limit(1);
    
    if (error) {
      console.error('Error querying clinics table:', error.message);
      console.error('Details:', error);
      
      // Try to see if we can at least connect by querying a non-existent table to see if it's auth issue
      const { data: versionData, error: versionError } = await supabase.rpc('version'); // Might not exist
      // Actually supabase-js doesn't have version rpc. Let's just see if we can get from pg_tables
      const { data: tablesData, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(5);
      
      if (!tablesError) {
        console.log('Available tables:', tablesData.map(t => t.table_name));
      } else {
        console.error('Could not query information_schema.tables:', tablesError.message);
      }
    } else {
      console.log('Successfully queried clinics table. Data:', data);
    }
    
    // Test services table
    const { data: servicesData, error: servicesError } = await supabase.from('services').select('*').limit(1);
    if (servicesError) {
      console.error('Error querying services table:', servicesError.message);
    } else {
      console.log('Successfully queried services table. Data:', servicesData);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testConnection();