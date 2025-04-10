import React, { useState } from 'react';
import AdminDashboard from '@/components/AdminDashboard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import SEO from '@/components/SEO';

// Simple auth for admin panel
const Admin = () => {
  const [password, setPassword] = useState('');
  const { isAuthenticated, login, logout } = useAdminAuth();
  const [error, setError] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setError('');
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 max-w-md">
        <SEO title="Admin Login | Jalwa Admin Panel" />
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Enter the admin password to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
                <Button type="submit">Login</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <SEO title="Admin Dashboard | Jalwa Admin Panel" />
      <div className="py-4 flex justify-end px-4 sm:px-0">
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
      <AdminDashboard />
    </div>
  );
};

export default Admin;