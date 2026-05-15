const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing env vars in process.env!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  try {
    const { data, error } = await supabase.from('cars').select('*');
    if (error) {
      console.error("Error:", error);
    } else {
      console.log(`Found ${data?.length} cars:`);
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.error("Exception:", e);
  }
}
check();
