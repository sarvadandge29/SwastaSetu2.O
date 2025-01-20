import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://cmjreviapzgjdgrcaqdm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtanJldmlhcHpnamRncmNhcWRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczODI5MDcsImV4cCI6MjA1Mjk1ODkwN30.c6zFnTbYtq4jz4TSuEstMfTE3Y8QaY8ULpk-gn1oe04";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);