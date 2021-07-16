import React, { useState } from 'react';
import { InertiaHead } from '@inertiajs/inertia-react';

import App from '../../Layouts/App';

import AmaranthIcon, { aiChangewindows, aiChangewindowsCan, aiChangewindowsDev, aiGithub, aiPatreon, aiTwitter } from '@changewindows/amaranth';

import { getLocal, setLocal } from '../../utils/localStorage';

export default function Show({ app, patrons }) {
    const [theme, setTheme] = useState(getLocal('theme'));
    const [showActiveOnly, setShowActiveOnly] = useState(getLocal('showActiveOnly'));

    function toggleTheme(mode) {
        if (mode === 'default') {
            setLocal('theme', 'default');
            setTheme('default');
            document.querySelector('html').classList.add('theme-default');
            document.querySelector('html').classList.remove('theme-light');
            document.querySelector('html').classList.remove('theme-dark');
        } else if (mode === 'light') {
            setLocal('theme', 'light');
            setTheme('light');
            document.querySelector('html').classList.add('theme-light');
            document.querySelector('html').classList.remove('theme-default');
            document.querySelector('html').classList.remove('theme-dark');
        } else {
            setLocal('theme', 'dark');
            setTheme('dark');
            document.querySelector('html').classList.add('theme-dark');
            document.querySelector('html').classList.remove('theme-light');
            document.querySelector('html').classList.remove('theme-default');
        }
    }
    
    function toggleShowActiveOnly() {
        setLocal('showActiveOnly', showActiveOnly ? 0 : 1);
        setShowActiveOnly(showActiveOnly ? 0 : 1);
    }

    return (
        <App>
            <InertiaHead title="Settings" />

            <nav className="navbar navbar-expand navbar-light sticky-top">
                <div className="container">
                    <span className="navbar-brand text-wrap">
                        Settings
                    </span>
                </div>
            </nav>
            
            <div className="container">
                <fieldset className="row g-3">
                    <div className="col-12 titlebar">
                        <h1>Settings</h1>
                    </div>
                    
                    <div className="col-12 col-md-4">
                        <h4 className="h5 mb-0">Theme</h4>
                        <p className="text-muted mb-0"><small>Turn off the lights! Or turn them on.</small></p>
                    </div>
                    <div className="col-12 col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-12 mt-3">
                                        <h6>Theme color</h6>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="theme" id="system" checked={theme === 'default'} onChange={() => toggleTheme('default')} />
                                            <label className="form-check-label" htmlFor="system">
                                                System
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="theme" id="dark" checked={theme === 'dark'} onChange={() => toggleTheme('dark')} />
                                            <label className="form-check-label" htmlFor="dark">
                                                Dark
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="theme" id="light" checked={theme === 'light'} onChange={() => toggleTheme('light')} />
                                            <label className="form-check-label" htmlFor="light">
                                                Light
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-12 col-md-4">
                        <h4 className="h5 mb-0">Channels</h4>
                        <p className="text-muted mb-0"><small>Change channels settings.</small></p>
                    </div>
                    <div className="col-12 col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-12 mt-3">
                                        <h6>Inactive channels</h6>
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" onChange={toggleShowActiveOnly} checked={showActiveOnly} id="showActiveChannelsOnly" />
                                            <label className="form-check-label" htmlFor="showActiveChannelsOnly">Only show active channels on the Channels-pages.</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-12 col-md-4">
                        <h4 className="h5 mb-0">Our Patrons</h4>
                        <p className="text-muted mb-0"><small>Meet the people who make ChangeWindows possible.</small></p>
                    </div>
                    <div className="col-12 col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <div className="row g-5 justify-content-center">
                                    {patrons.map((patron, key) => (
                                        <div className="col-6 col-sm-4 col-xl-3" key={key}>
                                            <div className="d-flex flex-column align-items-center">
                                                <img src={patron.avatar} alt={patron.name} style={{ width: 40, height: 40 }} className="rounded-circle" />
                                                <div className="mt-2">
                                                    <p className="fw-bold m-0 text-center">{patron.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-12 col-md-4">
                        <h4 className="h5 mb-0">About</h4>
                        <p className="text-muted mb-0"><small>About ChangeWindows.</small></p>
                    </div>
                    <div className="col-12 col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex flex-column">
                                    <h1 className="h3 mb-5 d-inline-flex">
                                        <AmaranthIcon icon={app.preview === 'preview' ? aiChangewindowsDev : (app.preview === 'canary' ? aiChangewindowsCan : aiChangewindows)} className="me-1 mt-1" />
                                        ChangeWindows {app.preview === 'preview' && 'Preview'}{app.preview === 'canary' && 'Canary'}
                                    </h1>

                                    <p className="lead mb-5 fw-normal" style={{ maxWidth: 600 }}>ChangeWindows is a detailed changelog and release history for Windows across all platforms it appears on. With detailed and timely updates, as well as a clean and clear interface, ChangeWindows' goal is to provide a solid resource for anyone interested in knowing what's next for Windows.</p>

                                    <div className="mb-5">
                                        <a href="https://twitter.com/changewindows" target="_blank" className="btn btn-primary btn-sm me-1"><AmaranthIcon icon={aiTwitter} /> Twitter</a>
                                        <a href="https://github.com/changewindows/horizon" target="_blank" className="btn btn-primary btn-sm me-1"><AmaranthIcon icon={aiGithub} /> GitHub</a>
                                        <a href="https://patreon.com/changewindows" target="_blank" className="btn btn-primary btn-sm me-1"><AmaranthIcon icon={aiPatreon} /> Patreon</a>
                                    </div>

                                    <a className="m-0 h4 f-384" href="https://studio384.be" target="_blank">Studio <span className="studio-384">384</span></a>
                                    <p className="m-0">&copy; 2014-2021 &middot; All Right Reserved &middot; <a href="https://github.com/changewindows/horizon/releases" target="_blank">Version {app.version}</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
        </App>
    )
}