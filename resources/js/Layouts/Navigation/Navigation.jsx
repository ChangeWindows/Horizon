import React from 'react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';

import NavigationBar from './components/NavigationBar';

import AmaranthIcon, { aiAdmin, aiBlog, aiChangewindows, aiChangewindowsCan, aiChangewindowsDev, aiChannels, aiDevices, aiPatreon, aiTimeline, aiTwitter } from '@changewindows/amaranth';

export default function Navigation() {
    const { auth, nav_can, app } = usePage().props;
   
    return (
        <>
            <nav className="navbar navbar-expand-xs navbar-light sticky-top">
                <div className="container-fluid">
                    <InertiaLink className="navbar-brand" href="/">
                        <img src={app.preview === 'preview' ? '/images/logo-preview.svg' : (app.preview === 'canary' ? '/images/logo-canary.svg' : '/images/logo.svg')} alt="ChangeWindows" className="app-icon" />
                        <span className="brand-label fw-bold">ChangeWindows</span>
                    </InertiaLink>
                </div>
            </nav>

            <NavigationBar
                auth={auth}
                main={[
                    { type: 'link', url: '/timeline', icon: aiTimeline, title: 'Timeline' },
                    { type: 'link', url: '/platforms', primary: '/pc', icon: aiDevices, title: 'Platforms' },
                    { type: 'link', url: '/channels', icon: aiChannels, title: 'Channels' }
                ]}
                overflow={[
                    { type: 'external', url: 'https://medium.com/changewindows', icon: aiBlog, title: 'Blog' },
                    { type: 'link', url: '/admin/flights', icon: aiAdmin, title: 'Backstage', permission: nav_can.access_dashboard },
                    { type: 'divider' },
                    { type: 'external', url: 'https://twitter.com/changewindows', icon: aiTwitter, title: '@ChangeWindows' },
                    { type: 'external', url: 'https://patreon.com/changewindows', icon: aiPatreon, title: 'Sponsor us' }
                ]}
            />
        </>
    )
}