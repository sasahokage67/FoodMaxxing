import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { VenueSelect } from './components/customer/VenueSelect';
import { MenuList } from './components/customer/MenuList';
import { CartDrawer } from './components/customer/CartDrawer';
import { OrderConfirmation } from './components/customer/OrderConfirmation';
import { ReadyPasscard } from './components/customer/ReadyPasscard';
import { MyOrdersList } from './components/customer/MyOrdersList';
import { KitchenDashboard } from './components/kitchen/KitchenDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Footer } from './components/common/Footer';

export const App: React.FC = () => {
  const { activeTab, customerStep } = useApp();

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111827] flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {activeTab === 'customer' && (
          <div className="w-full">
            {customerStep === 'venue' && <VenueSelect />}
            {customerStep === 'menu' && <MenuList />}
            {customerStep === 'slot' && <CartDrawer />}
            {customerStep === 'tracking' && <OrderConfirmation />}
            {customerStep === 'ready' && <ReadyPasscard />}
            {customerStep === 'history' && <MyOrdersList />}
          </div>
        )}

        {activeTab === 'kitchen' && <KitchenDashboard />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      <Footer />
    </div>
  );
};
