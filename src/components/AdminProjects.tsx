import React, { useEffect, useMemo, useState } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

import {
  Project,
  ProjectInput,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
} from '../services/projectService';
import './admin.css';

/* =============================================================
   Shared types
   ============================================================= */

type Tab = 'projects' | 'add' | 'edit' | 'security';
type Toast = { id: number; text: string; kind: 'ok' | 'err' };

const EMPTY_FORM: ProjectInput = {
  title: '',
  description: '',
  status: 'In progress',
  tags: [],
  live_url: '',
  github_url: '',
  image_url: '',
};

const STATUS_OPTIONS = ['Live', 'In progress', 'Archived', 'Concept'];

const NAV: { key: Tab; label: string }[] = [
  { key: 'projects', label: 'Projects' },
  { key: 'add', label: 'Add project' },
  { key: 'edit', label: 'Edit project' },
  { key: 'security', label: 'Security' },
];

/* =============================================================
   Auth helpers (Supabase Auth — real accounts, real hashed passwords)
   ============================================================= */

async function authLogin(email: string, password: string): Promise<Session> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.session) throw new Error('No session returned.');
  return data.session;
}

async function authLogout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

async function authGetSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

function authOnChange(callback: (session: Session | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) =>
    callback(session)
  );
  return () => data.subscription.unsubscribe();
}

async function authGetEmail(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.email ?? null;
}

async function authUpdatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

/* =============================================================
   Login screen
   ============================================================= */

const LoginScreen: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError('Enter both email and password.');
      return;
    }
    setSubmitting(true);
    try {
      await authLogin(email.trim(), password);
      onSuccess();
    } catch {
      setError('Incorrect email or password.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-login-root">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Admin</span>
        <h1>
          Sign in to your <span className="grad-text">dashboard.</span>
        </h1>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoFocus
            autoComplete="username"
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        {error && <div className="admin-login-error">{error}</div>}

        <button type="submit" className="btn btn-primary admin-login-btn" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
};

/* =============================================================
   Projects list section
   ============================================================= */

const ProjectsSection: React.FC<{
  onEdit: (project: Project) => void;
  pushToast: (text: string, kind?: 'ok' | 'err') => void;
  refreshToken: number;
}> = ({ onEdit, pushToast, refreshToken }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToken]);

  async function refresh() {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch {
      pushToast('Could not load projects.', 'err');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setConfirmDeleteId(null);
    try {
      await deleteProject(id);
      pushToast('Project deleted.');
    } catch {
      pushToast('Delete failed — refreshing list.', 'err');
      refresh();
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) =>
      [p.title, p.description, p.status, ...(Array.isArray(p.tags) ? p.tags : [])]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [projects, query]);

  return (
    <div>
      <div className="admin-toolbar">
        <input
          className="admin-search"
          placeholder="Search by title, tag, status…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="admin-empty">
          <span className="mono">Loading projects…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <h3>No projects yet</h3>
          <p>Use the "Add project" tab to create your first one.</p>
        </div>
      ) : (
        <div className="admin-table">
          <div className="admin-row admin-row-head">
            <span>Project</span>
            <span></span>
            <span>Tags</span>
            <span>Links</span>
            <span className="admin-row-actions">Actions</span>
          </div>

          {filtered.map((p) => (
            <div className="admin-row" key={p.id}>
              <div className="admin-row-title">
                <div className="admin-thumb">
                  {p.image_url ? <img src={p.image_url} alt={p.title} /> : <div className="admin-thumb-empty" />}
                </div>
                <div>
                  <div className="admin-row-name">{p.title}</div>
                  <div className="admin-row-desc">{p.description}</div>
                </div>
              </div>

              <span >
               
              </span>

              <div className="admin-tags-cell">
                {(Array.isArray(p.tags) ? p.tags : []).slice(0, 3).map((t) => (
                  <span key={t}>{t}</span>
                ))}
                {Array.isArray(p.tags) && p.tags.length > 3 && (
                  <span className="admin-tag-more">+{p.tags.length - 3}</span>
                )}
              </div>

              <div className="admin-links-cell">
                {p.live_url && (
                  <a href={p.live_url} target="_blank" rel="noopener noreferrer">
                    Live ↗
                  </a>
                )}
                {p.github_url && (
                  <a href={p.github_url} target="_blank" rel="noopener noreferrer">
                    Code ↗
                  </a>
                )}
              </div>

              <div className="admin-row-actions">
                <button className="admin-icon-btn" onClick={() => onEdit(p)}>
                  Edit
                </button>
                <button
                  className="admin-icon-btn admin-icon-btn-danger"
                  onClick={() => setConfirmDeleteId(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDeleteId !== null && (
        <div className="admin-modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
          <div className="admin-confirm" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this project?</h3>
            <p>This removes it permanently — including from the live site.</p>
            <div className="admin-confirm-actions">
              <button className="btn btn-ghost" onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDeleteId)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =============================================================
   Add / Edit project section (same form, two modes)
   ============================================================= */

const ProjectFormSection: React.FC<{
  mode: 'create' | 'edit';
  project: Project | null;
  onSaved: (project: Project, mode: 'create' | 'edit') => void;
  pushToast: (text: string, kind?: 'ok' | 'err') => void;
}> = ({ mode, project, onSaved, pushToast }) => {
  const [form, setForm] = useState<ProjectInput>(EMPTY_FORM);
  const [tagsDraft, setTagsDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && project) {
      setForm({
        title: project.title,
        description: project.description,
        status: project.status,
        tags: Array.isArray(project.tags) ? project.tags : [],
        live_url: project.live_url || '',
        github_url: project.github_url || '',
        image_url: project.image_url || '',
      });
      setTagsDraft(Array.isArray(project.tags) ? project.tags.join(', ') : '');
    } else {
      setForm(EMPTY_FORM);
      setTagsDraft('');
    }
  }, [mode, project]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      pushToast('Give the project a title first.', 'err');
      return;
    }

    const payload: ProjectInput = {
      ...form,
      tags: tagsDraft
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    setSaving(true);
    try {
      if (mode === 'edit' && project) {
        const updated = await updateProject(project.id, payload);
        pushToast('Project updated.');
        onSaved(updated, 'edit');
      } else {
        const created = await createProject(payload);
        pushToast('Project added.');
        setForm(EMPTY_FORM);
        setTagsDraft('');
        onSaved(created, 'create');
      }
    } catch {
      pushToast('Save failed. Check your connection and try again.', 'err');
    } finally {
      setSaving(false);
    }
  }

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadProjectImage(file);
      setForm((f) => ({ ...f, image_url: url }));
      pushToast('Image uploaded.');
    } catch {
      pushToast('Upload failed — paste an image URL instead.', 'err');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  if (mode === 'edit' && !project) {
    return (
      <div className="admin-empty">
        <h3>No project selected</h3>
        <p>Go to the Projects tab and hit "Edit" on a project to load it here.</p>
      </div>
    );
  }

  return (
    <form className="admin-page-form" onSubmit={handleSave}>
      <div className="field">
        <label>Title</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Project name"
        />
      </div>

      <div className="field">
        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="What it does, in a sentence or two"
        />
      </div>

      <div className="admin-field-row">
        <div className="field">
          <label>Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Tags (comma separated)</label>
          <input
            value={tagsDraft}
            onChange={(e) => setTagsDraft(e.target.value)}
            placeholder="React, TypeScript, Supabase"
          />
        </div>
      </div>

      <div className="admin-field-row">
        <div className="field">
          <label>Live URL</label>
          <input
            value={form.live_url}
            onChange={(e) => setForm({ ...form, live_url: e.target.value })}
            placeholder="https://…"
          />
        </div>
        <div className="field">
          <label>GitHub URL</label>
          <input
            value={form.github_url}
            onChange={(e) => setForm({ ...form, github_url: e.target.value })}
            placeholder="https://github.com/…"
          />
        </div>
      </div>

      <div className="field">
        <label>Image</label>
        <div className="admin-image-row">
          <div className="admin-image-preview">
            {form.image_url ? <img src={form.image_url} alt="" /> : <span className="mono">No image</span>}
          </div>
          <div className="admin-image-controls">
            <input
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="Paste an image URL…"
            />
            <label className="btn btn-ghost admin-upload-btn">
              {uploading ? 'Uploading…' : 'Upload file'}
              <input type="file" accept="image/*" hidden onChange={handleImagePick} disabled={uploading} />
            </label>
          </div>
        </div>
      </div>

      <div className="admin-page-form-foot">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Add project'}
        </button>
      </div>
    </form>
  );
};

/* =============================================================
   Security section (change password — real Supabase account)
   ============================================================= */

const SecuritySection: React.FC<{ pushToast: (text: string, kind?: 'ok' | 'err') => void }> = ({ pushToast }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    authGetEmail().then(setEmail);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      pushToast('Password must be at least 8 characters.', 'err');
      return;
    }
    if (newPassword !== confirmPassword) {
      pushToast('Passwords do not match.', 'err');
      return;
    }
    setSaving(true);
    try {
      await authUpdatePassword(newPassword);
      pushToast('Password updated.');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      pushToast('Could not update password. Try again.', 'err');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page-form">
      <div className="field">
        <label>Signed in as</label>
        <input value={email ?? '…'} disabled />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-field-row">
          <div className="field">
            <label>New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
          </div>
          <div className="field">
            <label>Confirm new password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="admin-page-form-foot">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Updating…' : 'Update password'}
          </button>
        </div>
      </form>
    </div>
  );
};

/* =============================================================
   Main export — login gate + sidebar dashboard
   ============================================================= */

export const AdminProjects: React.FC = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined); // undefined = checking
  const [tab, setTab] = useState<Tab>('projects');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    authGetSession().then(setSession);
    const unsubscribe = authOnChange(setSession);
    return unsubscribe;
  }, []);

  function pushToast(text: string, kind: 'ok' | 'err' = 'ok') {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }

  function handleEdit(project: Project) {
    setEditingProject(project);
    setTab('edit');
  }

  function handleSaved(_project: Project, _mode: 'create' | 'edit') {
    setRefreshToken((n) => n + 1);
    setEditingProject(null);
    setTab('projects');
  }

  async function handleLogout() {
    await authLogout();
  }

  if (session === undefined) {
    return (
      <div className="admin-root">
        <div className="admin-wrap">
          <span className="mono">Checking session…</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginScreen onSuccess={() => {}} />;
  }

  return (
    <div className="admin-dash-root">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="eyebrow">Henok Hailegnaw</span>
          <h2>Dashboard</h2>
        </div>

        <nav className="admin-nav">
          {NAV.map((item) => (
            <button
              key={item.key}
              className={`admin-nav-item ${tab === item.key ? 'admin-nav-item-active' : ''}`}
              onClick={() => setTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </aside>

      <main className="admin-dash-main">
        <header className="admin-dash-head">
          <h1>{NAV.find((n) => n.key === tab)?.label}</h1>
        </header>

        {tab === 'projects' && (
          <ProjectsSection onEdit={handleEdit} pushToast={pushToast} refreshToken={refreshToken} />
        )}
        {tab === 'add' && (
          <ProjectFormSection mode="create" project={null} onSaved={handleSaved} pushToast={pushToast} />
        )}
        {tab === 'edit' && (
          <ProjectFormSection mode="edit" project={editingProject} onSaved={handleSaved} pushToast={pushToast} />
        )}
        {tab === 'security' && <SecuritySection pushToast={pushToast} />}
      </main>

      <div className="admin-toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`admin-toast admin-toast-${t.kind}`}>
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;