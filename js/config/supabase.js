/* ================================= */
/*            CONFIG SUPABASE        */
/* ================================= */
export const SUPA_URL = "https://oafqjrzbkgvntwlekmlq.supabase.co";
export const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZnFqcnpia2d2bnR3bGVrbWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNDQ0NzYsImV4cCI6MjA4MDkyMDQ3Nn0.OPw0x8cpTRgp4IoC42mpU9H1Ld9K2cXGjBAJffAVX3I";


export const supabaseClient =
  window.supabase?.createClient(SUPA_URL, SUPA_KEY) ?? null;
