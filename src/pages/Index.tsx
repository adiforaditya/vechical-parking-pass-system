
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/AuthForm';
import { Navigation } from '@/components/Navigation';
import { ApplicationForm } from '@/components/ApplicationForm';
import { AdminPanel } from '@/components/AdminPanel';

const HomePage = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState(
    user?.role === 'admin' ? 'admin-dashboard' : 'user-dashboard'
  );

  const renderContent = () => {
    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Vehicle Parking Pass System
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Secure digital parking pass management for your organization
              </p>
            </div>
            <AuthForm onSuccess={() => setCurrentView(user?.role === 'admin' ? 'admin-dashboard' : 'user-dashboard')} />
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="py-8">
          {currentView === 'admin-dashboard' && <AdminPanel />}
          {currentView === 'admin-applications' && <AdminPanel />}
          {currentView === 'user-dashboard' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Welcome to your Dashboard
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Manage your parking pass applications and view your digital passes
                </p>
              </div>
            </div>
          )}
          {currentView === 'apply' && <ApplicationForm />}
          {currentView === 'my-passes' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold mb-6">My Parking Passes</h2>
              <p className="text-gray-600">Your approved parking passes will appear here.</p>
            </div>
          )}
        </main>
      </div>
    );
  };

  return renderContent();
};

const Index = () => {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  );
};

export default Index;
