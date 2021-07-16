import React from 'react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react'

import NavigationBar from './components/NavigationBar';

import { aiArrowLeft, aiBox, aiChannelsUp, aiDevices, aiLock, aiPlane, aiRocket, aiSoftwareBox, aiTwitter, aiUser, aiUserLock } from '@changewindows/amaranth';

export default function AdminNavigation() {
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
                    { type: 'link', url: '/admin/flights', icon: aiPlane, title: 'Flights', permission: nav_can.show_flights },
                    { type: 'link', url: '/admin/releases', icon: aiSoftwareBox, title: 'Releases', permission: nav_can.show_releases },
                    { type: 'link', url: '/admin/packages', icon: aiBox, title: 'Packages', permission: nav_can.show_releases },
                    { type: 'link', url: '/admin/platforms', icon: aiDevices, title: 'Platforms', permission: nav_can.show_platforms },
                    { type: 'link', url: '/admin/promotions', icon: aiChannelsUp, title: 'Promotions', permission: nav_can.show_flights },
                    { type: 'link', url: '/admin/launches', icon: aiRocket, title: 'Launches', permission: nav_can.show_flights }
                ]}
                overflow={[
                    { type: 'link', url: '/admin/tweet_streams', icon: aiTwitter, title: 'Twitter', permission: nav_can.show_tweet_streams },
                    { type: 'divider' },
                    { type: 'link', url: '/admin/users', icon: aiUser, title: 'Users', permission: nav_can.show_users },
                    { type: 'link', url: '/admin/roles', icon: aiUserLock, title: 'Roles', permission: nav_can.show_roles },
                    { type: 'link', url: '/admin/permissions', icon: aiLock, title: 'Permissions', permission: nav_can.show_permissions },
                    { type: 'divider' },
                    { type: 'link', url: '/timeline', icon: aiArrowLeft, title: 'Back' }
                ]}
            />
        </>
    )
}