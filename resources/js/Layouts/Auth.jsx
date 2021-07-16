import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';

import AmaranthIcon, { aiArrowLeft, aiChangewindows, aiChangewindowsCan, aiChangewindowsDev } from '@changewindows/amaranth';

import { getLocal, setLocal } from '../utils/localStorage';
import useMediaQuery from '../hooks/useMediaQuery';

export default function Auth({ children }) {
    const { app } = usePage().props;

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
	const matchesDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

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
        <div className="auth auth-flow" style={{ height: windowHeight }}>
            <div className="content">
                <a href="javascript:history.back()" className="btn btn-link btn-sm"><AmaranthIcon icon={aiArrowLeft} /> Back</a>
                <div className="auth-card">
                    <h1 className="h3 m-0 py-5 d-flex justify-content-center align-items-center">
                        <AmaranthIcon icon={app.preview === 'preview' ? aiChangewindowsDev : (app.preview === 'canary' ? aiChangewindowsCan : aiChangewindows)} className="me-1" />
                        ChangeWindows
                    </h1>
                    { children }
                </div>
            </div>
        </div>
    )
}