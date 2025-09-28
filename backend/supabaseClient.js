// Import Supabase client constructor
const { createClient } = require('@supabase/supabase-js');

// Read Supabase URL and key from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Create a Supabase client with URL and key
const supabase = createClient(supabaseUrl, supabaseKey);

// Export the supabase client for use in other modules
module.exports = supabase;
