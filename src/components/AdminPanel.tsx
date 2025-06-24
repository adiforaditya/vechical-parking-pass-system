
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Application {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  licensePlate: string;
  vehicleColor: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  adminComment?: string;
}

export const AdminPanel: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [comment, setComment] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const loadApplications = () => {
      const storedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      setApplications(storedApplications);
    };
    
    loadApplications();
  }, []);

  const handleStatusUpdate = (appId: string, newStatus: 'approved' | 'rejected') => {
    const updatedApplications = applications.map(app => 
      app.id === appId 
        ? { ...app, status: newStatus, adminComment: comment }
        : app
    );
    
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
    
    toast({
      title: "Application Updated",
      description: `Application has been ${newStatus}.`,
    });
    
    setSelectedApp(null);
    setComment('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const pendingCount = applications.filter(app => app.status === 'pending').length;
  const approvedCount = applications.filter(app => app.status === 'approved').length;
  const rejectedCount = applications.filter(app => app.status === 'rejected').length;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Approved Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Rejected Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No applications submitted yet.</p>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{app.userName}</h3>
                      <p className="text-sm text-gray-600">{app.userEmail}</p>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <span className="text-sm font-medium">Vehicle:</span>
                      <p className="text-sm">{app.vehicleYear} {app.vehicleMake} {app.vehicleModel}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">License Plate:</span>
                      <p className="text-sm">{app.licensePlate}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Color:</span>
                      <p className="text-sm">{app.vehicleColor}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Submitted:</span>
                      <p className="text-sm">{new Date(app.submittedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-sm font-medium">Reason:</span>
                    <p className="text-sm mt-1">{app.reason}</p>
                  </div>

                  {app.adminComment && (
                    <div className="mb-3 p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Admin Comment:</span>
                      <p className="text-sm mt-1">{app.adminComment}</p>
                    </div>
                  )}

                  {app.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => setSelectedApp(app)}
                      >
                        Review
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Review Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">{selectedApp.userName}</h3>
                <p className="text-sm text-gray-600">
                  {selectedApp.vehicleYear} {selectedApp.vehicleMake} {selectedApp.vehicleModel} - {selectedApp.licensePlate}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Admin Comment (optional)</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment for the applicant..."
                  className="mt-1"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusUpdate(selectedApp.id, 'approved')}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleStatusUpdate(selectedApp.id, 'rejected')}
                >
                  Reject
                </Button>
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedApp(null);
                  setComment('');
                }}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
