import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace with your actual Supabase Project URL and Anon Key
const supabaseUrl = 'https://bylkdcwbzgjyjydekpsf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bGtkY3diemdqeWp5ZGVrcHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MjE2NTEsImV4cCI6MjA2Njk5NzY1MX0.OmHwhHxkv1JsKC_2rBZd-aASpOCt_0gNnu4Guee-CC8'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
