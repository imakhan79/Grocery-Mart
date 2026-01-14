
import React from 'react';
import { AppProvider, useAppContext } from './store';
import { UserRole } from './types';
import CustomerPortal from './components/Customer';
import AdminDashboard from './components/Admin';
import PartnerPortal from './components/Partner';
import LoginScreen from './components/LoginScreen';

const RootView: React.FC = () => {
  const { user } = useAppContext();

  if (!user) {
    return <LoginScreen />;
  }

  switch (user.role) {
    case UserRole.ADMIN:
    case UserRole.STORE_MANAGER:
      return <AdminDashboard />;
    case UserRole.DELIVERY_PARTNER:
      return <PartnerPortal />;
    case UserRole.CUSTOMER:
    default:
      return <CustomerPortal />;
  }
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen">
        <RootView />
      </div>
    </AppProvider>
  );
};

export default App;
