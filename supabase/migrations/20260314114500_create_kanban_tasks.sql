/*
  # Create Kanban Tasks Table

  1. New Tables
    - `kanban_tasks`
      - `id` (uuid, primary key) - Unique identifier for each task
      - `title` (text) - Task title
      - `description` (text, optional) - Task description
      - `status` (text) - Current status (todo, in_progress, done)
      - `position` (integer) - Position within the column for ordering
      - `created_at` (timestamptz) - When the task was created
      - `updated_at` (timestamptz) - When the task was last updated

  2. Security
    - Enable RLS on `kanban_tasks` table
    - Add policy for anyone to read tasks (public board)
    - Add policy for anyone to insert tasks (public board)
    - Add policy for anyone to update tasks (public board)
    - Add policy for anyone to delete tasks (public board)

  Note: This is a public kanban board accessible to all users. 
  For a production app with authentication, these policies should be restricted to authenticated users only.
*/

CREATE TABLE IF NOT EXISTS kanban_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'todo',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE kanban_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view kanban tasks"
  ON kanban_tasks FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert kanban tasks"
  ON kanban_tasks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update kanban tasks"
  ON kanban_tasks FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete kanban tasks"
  ON kanban_tasks FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_kanban_tasks_status ON kanban_tasks(status);
CREATE INDEX IF NOT EXISTS idx_kanban_tasks_position ON kanban_tasks(position);