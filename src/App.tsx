import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MinimalLayout from 'src/components/layout/MinimalLayout';
import 'src/styles/index.css';

const LandingHero = lazy(() => import('src/components/sections/LandingHero'));
const AboutPage = lazy(() => import('src/pages/AboutPage'));
const ContactPage = lazy(() => import('src/pages/ContactPage'));
const ExperiencePage = lazy(() => import('src/pages/ExperiencePage'));

const App = () => {
  return (
    <BrowserRouter>
      <MinimalLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingHero />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<div>Features Page</div>} />
            <Route path="/pricing" element={<div>Pricing Page</div>} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
          </Routes>
        </Suspense>
      </MinimalLayout>
    </BrowserRouter>
  );
};

export default App;