import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const configs = {
        success: {
            icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
            border: 'border-emerald-500/30',
            bg: 'bg-emerald-500/10',
            shadow: 'shadow-emerald-500/20',
            title: 'Success'
        },
        error: {
            icon: <XCircle className="w-5 h-5 text-red-400" />,
            border: 'border-red-500/30',
            bg: 'bg-red-500/10',
            shadow: 'shadow-red-500/20',
            title: 'Error'
        },
        warning: {
            icon: <AlertCircle className="w-5 h-5 text-amber-400" />,
            border: 'border-amber-500/30',
            bg: 'bg-amber-500/10',
            shadow: 'shadow-amber-500/20',
            title: 'Warning'
        },
        info: {
            icon: <Info className="w-5 h-5 text-cyan-400" />,
            border: 'border-cyan-500/30',
            bg: 'bg-cyan-500/10',
            shadow: 'shadow-cyan-500/20',
            title: 'Note'
        }
    };

    const config = configs[type];

    return (
        <div className={`relative overflow-hidden rounded-2xl border ${config.border} ${config.bg} backdrop-blur-xl p-4 shadow-lg ${config.shadow} group`}>
            {/* Animated background glow */}
            <div className={`absolute -right-4 -top-4 w-16 h-16 blur-2xl opacity-20 transition-opacity group-hover:opacity-40`} 
                 style={{ backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#06b6d4' }} 
            />
            
            <div className="flex gap-4 items-start pr-8">
                <div className="mt-0.5">
                    {config.icon}
                </div>
                <div className="flex-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        {config.title}
                    </h4>
                    <p className="text-sm text-gray-200 leading-relaxed font-medium">
                        {message}
                    </p>
                </div>
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Progress bar at the bottom */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-white/10 w-full overflow-hidden">
                <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className={`h-full`}
                    style={{ backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#06b6d4' }}
                />
            </div>
        </div>
    );
};

export default Toast;
