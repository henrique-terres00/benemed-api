import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://znofnqgyqevnnuslxelm.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpub2ZucWd5cWV2bm51c2x4ZWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczMTIzODcsImV4cCI6MjA1Mjg4ODM4N30.n_2ybKRAe-MYwY2Rm5eFwax_vHaP14tU5k0D7deux0Y';

export const supabase = createClient(supabaseUrl, supabaseKey);
