const supabaseKey = import.meta.env.VITE_APP_API_KEY;
const supabaseUrl = import.meta.env.VITE_APP_BASE_URL;
import { createClient } from '@supabase/supabase-js'


const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;


