import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-primary-500/30">
            <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-10 opacity-20"></div>

            <Navbar />

            <main className="container mx-auto px-4 pt-24 pb-12">
                <Outlet />
            </main>

            <footer className="w-full py-6 text-center text-gray-500 text-sm border-t border-white/5 mt-auto">
                <p>© 2026 GiftBlitz. Built on IOTA.</p>
            </footer>
        </div>
    );
};

export default Layout;
