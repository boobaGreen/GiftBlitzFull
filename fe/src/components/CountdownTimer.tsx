import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
    targetTime: number; // Timestamp in ms
    onExpire?: () => void;
    label?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetTime, onExpire, label }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [hasExpired, setHasExpired] = useState(false);

    useEffect(() => {
        const checkTime = () => {
            const now = Date.now();
            const diff = targetTime - now;
            
            if (diff <= 0) {
                setTimeLeft(0);
                if (!hasExpired) {
                    setHasExpired(true);
                    if (onExpire) onExpire();
                }
            } else {
                setTimeLeft(diff);
                setHasExpired(false);
            }
        };

        checkTime();
        const interval = setInterval(checkTime, 1000);
        
        return () => clearInterval(interval);
    }, [targetTime, onExpire, hasExpired]);

    if (timeLeft <= 0) {
        return (
            <div className="flex items-center gap-2 text-red-400 font-mono text-sm bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                <Clock className="w-4 h-4" />
                <span>EXPIRED</span>
            </div>
        );
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return (
        <div className="flex items-center gap-2 text-orange-400 font-mono text-sm bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            <Clock className="w-4 h-4" />
            <span>{label || "Time Left"}: {hours}h {minutes}m {seconds}s</span>
        </div>
    );
};

export default CountdownTimer;
