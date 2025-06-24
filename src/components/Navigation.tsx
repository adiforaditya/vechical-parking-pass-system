
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900">Parking Pass System</h1>
            <div className="flex space-x-4">
              {user.role === 'admin' ? (
                <>
                  <Button
                    variant={currentView === 'admin-dashboard' ? 'default' : 'ghost'}
                    onClick={() => onViewChange('admin-dashboard')}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant={currentView === 'admin-applications' ? 'default' : 'ghost'}
                    onClick={() => onViewChange('admin-applications')}
                  >
                    Applications
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant={currentView === 'user-dashboard' ? 'default' : 'ghost'}
                    onClick={() => onViewChange('user-dashboard')}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant={currentView === 'apply' ? 'default' : 'ghost'}
                    onClick={() => onViewChange('apply')}
                  >
                    Apply for Pass
                  </Button>
                  <Button
                    variant={currentView === 'my-passes' ? 'default' : 'ghost'}
                    onClick={() => onViewChange('my-passes')}
                  >
                    My Passes
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Welcome, {user.name}</span>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
