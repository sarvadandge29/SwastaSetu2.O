import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://llkuxbyxxliwnjuzywjb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsa3V4Ynl4eGxpd25qdXp5d2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2NjU2ODUsImV4cCI6MjA1MzI0MTY4NX0.TrNUkSdwk7P_ComrR-d4C8XGrngR8IC1VyWnSgluueE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);