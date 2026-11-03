import { supabase } from '../lib/supabase';

export interface ProjectInput {
  title: string;
  description: string;
  status: string;
  tags: string[];
  live_url: string;
  github_url: string;
  image_url?: string;
}

export interface Project extends ProjectInput {
  id: number;
}

// Target bucket name (matches the cleaned bucket name in Supabase Storage)
const BUCKET_NAME = 'project-images.'; 

/**
 * Fetch all projects, newest first
 */
export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error('Error loading projects:', error);
    throw error;
  }

  return data || [];
}

// Alias to ensure compatibility with Admin component imports
export const getProjects = getAllProjects;

/**
 * Create a new project row
 */
export async function createProject(input: ProjectInput): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }

  return data;
}

/**
 * Update an existing project by ID
 */
export async function updateProject(id: number, input: ProjectInput): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw error;
  }

  return data;
}

/**
 * Delete a project by ID
 */
export async function deleteProject(id: number): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

/**
 * Upload an image to Supabase Storage and return its public URL
 */
export async function uploadProjectImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return data.publicUrl;
}