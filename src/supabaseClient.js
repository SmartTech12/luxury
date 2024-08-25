// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://weqmwykxcjeokyvyossh.supabase.co'; // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlcW13eWt4Y2plb2t5dnlvc3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ1NDgyODEsImV4cCI6MjA0MDEyNDI4MX0.riHOqkh7uoClxa2rJGD79Ve0jwb-Xzu-mj9BMG0_0co'; // Replace with your Supabase anon key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
