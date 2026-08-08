import { StackCategory, Project, Service, Testimonial, StoryItem, SocialLink } from '../types';

export const PERSONAL_INFO = {
  name: 'Henok Hailegnaw',
  role: 'Full Stack Developer',
  eyebrow: 'FULL STACK DEVELOPER',
  tagline: 'I design the human side. I build the code side.',
  bioLead: 'Half of what I build is visible — responsive interfaces, smooth interactions, and clean design. The other half is behind the scenes — secure backends, databases, and APIs working together seamlessly.',
  bioBody: "I'm a self-taught full-stack web developer who builds complete web applications from concept to deployment. I specialize in React.js, PHP, MySQL, and Supabase, creating scalable solutions that are fast, secure, and user-focused. From e-commerce platforms and school management systems to rental websites and custom admin dashboards, I enjoy turning ideas into reliable digital products that solve real-world problems.",
  aboutTags: ['Frontend', 'Backend', 'Databases', 'Design', 'React.js'],
};

export const STORY_ITEMS: StoryItem[] = [
  {
    yr: '01',
    title: 'Discovery & Architecture',
    description: 'Mapping out project requirements, user flows, and database relationships before writing code.',
  },
  {
    yr: '02',
    title: 'UI Construction',
    description: 'Building intuitive, mobile-first component interfaces designed for maximum usability.',
  },
  {
    yr: '03',
    title: 'Backend Integration',
    description: 'Setting up APIs, authentication logic, and database connections to process real-time data.',
  },
  {
    yr: '04',
    title: 'Testing & Launch',
    description: 'Optimizing load performance, running cross-browser checks, and deploying to production.',
  },
];

export const SKILL_STACKS: StackCategory[] = [
  {
    cat: 'frontend',
    title: 'frontend.stack',
    skills: [
      { name: 'React.js', pct: 90 },
      { name: 'JavaScript', pct: 91 },
      { name: 'HTML5', pct: 96 },
      { name: 'CSS3', pct: 95 },
      { name: 'Bootstrap', pct: 96 },
      { name: 'Responsive Design', pct: 89 },
    ],
  },
  {
    cat: 'backend',
    title: 'backend.stack',
    skills: [
      { name: 'PHP', pct: 94 },
      { name: 'Node.js', pct: 88 },
      { name: 'MySQL', pct: 93 },
      { name: 'Supabase', pct: 89 },
      { name: 'API Integration', pct: 90 },
    ],
  },
  {
    cat: 'tools',
    title: 'tools.stack',
    skills: [
      { name: 'Git', pct: 89 },
      { name: 'GitHub', pct: 93 },
      { name: 'UI Development', pct: 88 },
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'solace-dashboard',
    title: 'Solace Dashboard',
    description: 'A real-time analytics dashboard with a Node.js API layer, rebuilt for speed and clarity — first interaction time cut in half.',
    status: 'Live',
    tags: ['React', 'Node.js', 'REST API'],
    demoUrl: '#',
    githubUrl: '#',
  },
  {
    id: 'atlas-studio',
    title: 'Atlas Studio Site',
    description: 'An interactive brand site for a design collective, built around a scroll-driven motion system and a headless CMS backend.',
    status: 'Case study',
    tags: ['Next.js', 'Tailwind', 'UI/UX'],
    demoUrl: '#',
    githubUrl: '#',
  },
  {
    id: 'northfield-banking',
    title: 'Northfield Banking',
    description: 'An accessibility-first rebuild of a banking platform, frontend and backend — WCAG AA without losing polish.',
    status: 'Live',
    tags: ['React', 'MongoDB', 'Responsive'],
    demoUrl: '#',
    githubUrl: '#',
  },
];

export const SERVICES: Service[] = [
  {
    num: '01',
    title: 'Full-Stack Web Development',
    description: 'Complete web applications built from frontend to backend with clean architecture and scalable solutions.',
  },
  {
    num: '02',
    title: 'Frontend Development',
    description: 'Responsive, interactive interfaces built with React.js, JavaScript, HTML5, CSS3, and Bootstrap.',
  },
  {
    num: '03',
    title: 'Backend Development',
    description: 'Secure backend systems using Node.js, PHP, MySQL, Supabase, authentication, and business logic.',
  },
  {
    num: '04',
    title: 'Database & API Integration',
    description: 'Designing databases and connecting applications through reliable REST APIs and Supabase services.',
  },
  {
    num: '05',
    title: 'Admin Dashboards',
    description: 'Custom dashboards with user management, analytics, and role-based access for businesses.',
  },
  {
    num: '06',
    title: 'Performance & Responsive Design',
    description: 'Fast-loading, mobile-friendly websites optimized for performance across every device.',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Eyob turned a vague idea into a full product — frontend and backend — that felt inevitable. Rare range.',
    avatar: 'S',
    name: 'Sara Neman',
    role: 'Product Lead, Solace',
  },
  {
    quote: 'Fast, communicative, and genuinely cares about the craft on both sides of the stack.',
    avatar: 'D',
    name: 'Dawit Alemu',
    role: 'Founder, Atlas Studio',
  },
  {
    quote: 'He rebuilt our platform end to end to meet accessibility standards without it ever feeling like a compromise.',
    avatar: 'M',
    name: 'Maren Cole',
    role: 'CTO, Northfield',
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', badge: 'GH', href: '#', colorVar: 'var(--azure-soft)' },
  { label: 'LinkedIn', badge: 'in', href: '#', colorVar: 'var(--rose-soft)' },
  { label: 'Instagram', badge: 'IG', href: '#', colorVar: 'var(--emerald-soft)' },
  { label: 'Telegram', badge: 'TG', href: '#', colorVar: 'var(--gold-soft)' },
  { label: 'Email', badge: '✉', href: 'mailto:hello@eyobtesfaye.dev', colorVar: 'var(--rose-soft)' },
];

export const CODE_STREAM_LINES = [
  "const app = createServer()", "export function App(){", "  return <Portrait/>", "}",
  "import express from 'express'", "app.get('/api', (req,res) => {", "  res.json(data)", "})",
  "type Props = {", "  glow: boolean", "}", "await db.connect()",
  "// craft > speed", "git commit -m 'ship'", "npm run build", "status: online",
];
