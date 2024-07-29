import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://vzfmcukqmoanbgdjaikw.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6Zm1jdWtxbW9hbmJnZGphaWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIwOTUwODAsImV4cCI6MjAzNzY3MTA4MH0.70ABFSeFWWYAOMC1ih32pakaJGjOLPKWXtYAuOi3fYs"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})