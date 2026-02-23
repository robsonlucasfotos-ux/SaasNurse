'use client';

import React, { createContext, useContext, useState } from 'react';

interface MobileNavContextType {
    isSidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;
}

const MobileNavContext = createContext<MobileNavContextType | undefined>(undefined);

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    return (
        <MobileNavContext.Provider value={{ isSidebarOpen, setSidebarOpen, toggleSidebar }}>
            {children}
        </MobileNavContext.Provider>
    );
}

export function useMobileNav() {
    const context = useContext(MobileNavContext);
    if (!context) {
        throw new Error('useMobileNav must be used within a MobileNavProvider');
    }
    return context;
}
