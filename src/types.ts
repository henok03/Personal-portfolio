export interface SkillRow {
  name: string;
  pct: number;
}

export interface StackCategory {
  cat: 'frontend' | 'backend' | 'tools';
  title: string;
  skills: SkillRow[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  tags: string[];
  demoUrl: string;
  githubUrl: string;
}

export interface Service {
  num: string;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  avatar: string;
  name: string;
  role: string;
}

export interface StoryItem {
  yr: string;
  title: string;
  description: string;
}

export interface SocialLink {
  label: string;
  badge: string;
  href: string;
  colorVar: string;
}
