import React, { useEffect, useRef, useState } from 'react';
import { getProjects } from '../services/projectService';

interface Project {
  id: number;
  status: string;
  title: string;
  description: string;
  tags: string[] | string;
  live_url: string;
  github_url: string;
  image_url?: string; // Added image URL field
}

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    if (!window.matchMedia('(hover: hover)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    card.style.transition =
      'transform .5s cubic-bezier(.16,.84,.32,1), border-color .4s ease';

    const handleMouseMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;

      card.style.transform =
        `perspective(900px) rotateY(${x * 8}deg) ` +
        `rotateX(${-y * 8}deg) translateY(-4px)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = '';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const parseTags = (rawTags: string[] | string): string[] => {
    if (Array.isArray(rawTags)) return rawTags;
    if (typeof rawTags === 'string') {
      try {
        const parsed = JSON.parse(rawTags);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return rawTags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }
    return [];
  };

  const tagsList = parseTags(project.tags);

  return (
    <article ref={cardRef} className="proj-card">
      {/* Project visual area with Image */}
      <div className="proj-visual">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="proj-img"
          />
        ) : (
          <div className="plate" />
        )}

       
      </div>

      {/* Project content body */}
      <div className="proj-body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>

        {tagsList.length > 0 && (
          <div className="proj-tags">
            {tagsList.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}

        <div className="proj-links">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live demo →
            </a>
          )}

          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub →
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects();
        setProjects(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects">
        <div className="wrap">
          <div className="sec-head" >
            <div>
              <span className="eyebrow">Projects</span>
              <h3>Loading projects...</h3>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="eyebrow">Selected work</span>
            <h2>
              Recent <span className="grad-text">projects.</span>
            </h2>
          </div>
         
        </div>

        <div className="proj-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};