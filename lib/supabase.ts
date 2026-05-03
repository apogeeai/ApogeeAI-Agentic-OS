import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type KanbanTask = {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done' | 'backlog';
  position: number;
  created_at: string;
  updated_at: string;
};
