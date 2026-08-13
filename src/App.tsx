/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loader } from './components/Loader';
import { CosmicBackground } from './components/CosmicBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Services } from './components/Services';

import { Contact } from './components/Contact';
import { Social } from './components/Social';
import { Footer } from './components/Footer';
import { AdminProjects } from './components/AdminProjects';
import { useScrollReveal } from './hooks/useScrollReveal';

function PortfolioPage() {
  useScrollReveal();

  return (
    <div className="relative w-full min-h-screen text-white bg-transparent">
      <Loader />

      {/* Three.js Background canvas rendered behind content */}
      <CosmicBackground />

      <Navbar />

      <main className="relative z-0">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Services />
      
        <Contact />
        <Social />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/admin" element={<AdminProjects />} />
      </Routes>
    </BrowserRouter>
  );
}