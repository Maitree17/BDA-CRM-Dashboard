import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState } from 'react';

const Layout = () => {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <main
        className="ml-64 min-h-screen transition-all duration-300"
        style={{ background: 'var(--bg-primary)' }}
      >
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
