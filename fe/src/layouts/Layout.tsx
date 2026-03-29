import React from 'react';
import Navbar from '../components/Navbar';
import { Globe, Linkedin } from 'lucide-react';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-primary-500/30">
            <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-10 opacity-20"></div>

            {/* Global Header Blur Belt - Premium Aesthetic */}
            <div className="fixed top-0 left-0 right-0 h-28 bg-[#050505]/40 backdrop-blur-xl z-[90] pointer-events-none [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]" />

            <Navbar />

            <main className="container mx-auto px-4 pt-32 pb-12">
                <Outlet />
            </main>

            <footer className="w-full py-8 border-t border-white/5 mt-auto bg-[#050505]/20 backdrop-blur-sm">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-gray-500 text-sm">
                        <p>© 2026 GiftBlitz. Built on IOTA.</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <a 
                            href="https://www.claudiodallara.it/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-all duration-300 group"
                        >
                            <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            <span className="text-sm font-medium">Personal Website</span>
                        </a>
                        <a 
                            href="https://www.linkedin.com/in/claudio-dall-ara-730aa0302/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-400 hover:text-[#0077b5] transition-all duration-300 group"
                        >
                            <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">LinkedIn</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
