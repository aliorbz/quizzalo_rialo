import { createClient } from '@supabase/supabase-js';

const getEnvVar = (name: string): string | undefined => {
  try {
    const meta = import.meta as any;
    if (meta && meta.env && meta.env[name]) {
      return meta.env[name];
    }
  } catch (e) {}

  try {
    if (typeof process !== 'undefined' && process.env && (process.env as any)[name]) {
      return (process.env as any)[name];
    }
  } catch (e) {}

  return undefined;
};

// Use your specific project credentials as fallbacks
const URL = "https://zhqxdyrnktbdeycdokdr.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocXhkeXJua3RiZGV5Y2Rva2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NDE1NTksImV4cCI6MjA4NTUxNzU1OX0.6PCMO2QQvCn6bv9MKHH-vV6y8CNXaN-BRRft5ZaGeZw";

let supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || URL;
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || KEY;

// Clean up URL
if (supabaseUrl && supabaseUrl.endsWith('/')) {
  supabaseUrl = supabaseUrl.slice(0, -1);
}

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
