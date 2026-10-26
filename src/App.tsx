/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SiteProvider, useSite } from './context/SiteContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { HomePage } from './pages/HomePage';
import { VideoLibraryPage } from './pages/VideoLibraryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { testFirestoreConnection } from './lib/firebase';

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const { activeVideo, setActiveVideo } = useSite();

  useEffect(() => {
    // Validate connection to Firestore on boot per Firebase skill
    testFirestoreConnection();
  }, []);

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <HomePage onNavigate={setCurrentTab} />;
      case 'library':
        return <VideoLibraryPage />;
      case 'about':
        return <AboutPage onNavigate={setCurrentTab} />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <LoginPage onNavigate={setCurrentTab} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentTab} />;
      case 'reset-password':
        return <ResetPasswordPage onNavigate={setCurrentTab} />;
      case 'profile':
        return <UserProfilePage onNavigate={setCurrentTab} />;
      case 'admin':
        return <AdminDashboard onNavigate={setCurrentTab} />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsPage />;
      default:
        return <HomePage onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1">
        {renderContent()}
      </main>

      <Footer onNavigate={setCurrentTab} />

      {/* Global YouTube Player Modal */}
      <VideoPlayerModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SiteProvider>
        <MainLayout />
      </SiteProvider>
    </AuthProvider>
  );
}
