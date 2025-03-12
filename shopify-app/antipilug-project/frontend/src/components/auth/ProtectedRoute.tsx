import React from 'react';
import { Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  // Temporarily allow all access
  return <Outlet />;
};

export default ProtectedRoute;