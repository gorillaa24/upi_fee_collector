import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FormPage } from './pages/FormPage';
import { ResultPage } from './pages/ResultPage';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const { dark, toggle } = useDarkMode();

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Subtle background gradient */}
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background: dark
              ? 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(79,70,229,0.12) 0%, transparent 60%)'
              : 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.08) 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header dark={dark} onToggleDark={toggle} />

          <Routes>
            <Route path="/" element={<FormPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
