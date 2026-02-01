import { createClient } from '@supabase/supabase-js';

// Hardcoded fallbacks based on your project configuration to ensure 
// functionality in static preview environments where .env is not injected.
const FALLBACK_URL = "https://zhqxdyrnktbdeycdokdr.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocXhkeXJua3RiZGV5Y2Rva2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NDE1NTksImV4cCI6MjA4NTUxNzU1OX0.6PCMO2QQvCn6bv9MKHH-vV6y8CNXaN-BRRft5ZaGeZwit";

/**
 * Robustly retrieves environment variables from various possible locations.
 */
const getEnvVar = (name: string): string | undefined => {
  // 1. Try process.env
  try {
    if (typeof process !== 'undefined' && process.env && (process.env as any)[name]) {
      return (process.env as any)[name];
    }
  } catch (e) {}

  // 2. Try import.meta.env
  try {
    const meta = import.meta as any;
    if (meta && meta.env && meta.env[name]) {
      return meta.env[name];
    }
  } catch (e) {}

  // 3. Try window
  try {
    if (typeof window !== 'undefined' && (window as any)[name]) {
      return (window as any)[name];
    }
  } catch (e) {}

  return undefined;
};

// Use environment variables if available, otherwise use hardcoded project fallbacks
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || FALLBACK_URL;
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || FALLBACK_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;
