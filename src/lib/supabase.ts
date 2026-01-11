import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lxizusqvacbsjnhyzwif.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4aXp1c3F2YWNic2puaHl6d2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODM3ODYsImV4cCI6MjA4MzU1OTc4Nn0.jYjb_y2x9etbhb6A3FNN2iKO-DAJa4uVF-ZznYmW6Gs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
