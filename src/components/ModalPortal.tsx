'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * ModalPortal — Renders children outside the DOM hierarchy (attached to document.body),
 * bypassing any CSS stacking context created by parent elements (transforms, overflow, etc.)
 */
export default function ModalPortal({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const el = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setMounted(true);
        if (!el.current) {
            el.current = document.createElement('div');
        }
        const portal = el.current;
        document.body.appendChild(portal);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            if (portal && document.body.contains(portal)) {
                document.body.removeChild(portal);
            }
            document.body.style.overflow = '';
        };
    }, []);

    if (!mounted || !el.current) return null;

    return createPortal(children, el.current);
}
