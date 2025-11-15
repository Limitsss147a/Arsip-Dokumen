import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://aqzvwfhncqjplkwtcgzv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxenZ3ZmhuY3FqcGxrd3RjZ3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMjAzOTMsImV4cCI6MjA3ODc5NjM5M30.yRuuhglGcUDhooyo1bNZgbCmwuw7hKnv6e1N4HQp-zc'

export const supabase = createClient(supabaseUrl, supabaseKey)