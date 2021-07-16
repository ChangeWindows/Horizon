import React, { useEffect, useState } from 'react';
import { usePage, InertiaHead } from '@inertiajs/inertia-react';

import AdminNavigation from './Navigation/AdminNavigation';

import { getLocal, setLocal } from '../utils/localStorage';
import useMediaQuery from '../hooks/useMediaQuery';

export default function App({ children }) {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
	const matchesDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const { app } = usePage().props;

    useEffect(() => {
        window.addEventListener('resize', function() {
            setWindowHeight(window.innerHeight);
        });

        () => window.removeEventListener('resize');
    });

    useEffect(() => {
        const theme = getLocal('theme');

        if (theme === 'default') {
            if (matchesDarkMode) {
                document.head.children['color-scheme'].content = 'dark';
            } else {
                document.head.children['color-scheme'].content = 'light';
            }
        }
    }, [matchesDarkMode]);

    useEffect(() => {
        const theme = getLocal('theme');

        if (!theme) {
            setLocal('theme', 'default');
        } else if (theme === 'light') {
            document.querySelector('html').classList.add('theme-light');
            document.querySelector('html').classList.remove('theme-default');
            document.head.children['color-scheme'].content = 'light';
        } else if (theme === 'dark') {
            document.querySelector('html').classList.add('theme-dark');
            document.querySelector('html').classList.remove('theme-default');
            document.head.children['color-scheme'].content = 'dark';
        }
    });

    return (
        <div className="bg-light">
            <InertiaHead title="Backstage" />

            <div className="grid" style={{ height: windowHeight }}>
                <header className="grid-sidebar">
                    <AdminNavigation />
                </header>
                <main className="grid-content">
                    { children }
                </main>
            </div>
        </div>
    )
}