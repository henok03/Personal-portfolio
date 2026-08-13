import { supabase } from '../lib/supabase';

export type Project = {
  id: number;
  title: string;
  description: string;
  status: string;
  tags: string[];
  live_url: string;
  github_url: string;
  image_url: string;
  created_at?: string;
};

export type ProjectInput = Omit<Project, 'id' | 'created_at'>;

const IMAGE_BUCKET = 'project-images.';

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false }); // Sorts by newest created_at date

  if (error) throw error;
  return data;
}

export async function createProject(payload: ProjectInput): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }

  return data as Project;
}

export async function updateProject(id: number, payload: ProjectInput): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw error;
  }

  return data as Project;
}

export async function deleteProject(id: number): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

export async function uploadProjectImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}