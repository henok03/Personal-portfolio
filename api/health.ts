import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id')
      .limit(1);

    if (error) {
      return Response.json({ status: 'error', error: error.message }, { status: 500 });
    }

    return Response.json({ status: 'ok', data });
  } catch (err: any) {
    return Response.json({ status: 'error', message: err.message }, { status: 500 });
  }
}