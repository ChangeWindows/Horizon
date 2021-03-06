import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

import Admin from '../../../Layouts/Admin';
import NaviBar from '../../../Components/NaviBar';

import AmaranthIcon, { aiCheck, aiFloppyDisc } from '@changewindows/amaranth';

export default function Create({ urls, releases, channels, channel, params }) {
    const [curReleaseChannel, setCurReleaseChannel] = useState({
        name: channel.name,
        short_name: channel.name.split(' ')[0],
        supported: 1,
        channel_id: params.channel,
        release_id: params.release
    });

    function formHandler(event) {
        const { id, value, type } = event.target;
        const _releaseChannel = Object.assign({}, curReleaseChannel);

        switch (type) {
            case 'checkbox':
                _releaseChannel[id] = _releaseChannel[id] === 0 ? 1 : 0;
                break;
            default:
                _releaseChannel[id] = value;
                break;
        }

        setCurReleaseChannel(_releaseChannel);
    }

    function handleSubmit(event) {
      event.preventDefault();
      Inertia.post(urls.store_release_channel, curReleaseChannel);
    }

    return (
        <Admin>
            <form onSubmit={handleSubmit}>
                <NaviBar
                    back="/admin/releases"
                    actions={
                        <button className="btn btn-primary btn-sm" type="submit"><AmaranthIcon icon={aiFloppyDisc} /> Save</button>
                    }
                >
                    {curReleaseChannel.name || 'Unnamed channel'}
                </NaviBar>
            
                <div className="container my-3">
                    {status &&
                        <div className="alert alert-success"><AmaranthIcon icon={aiCheck} /> {status}</div>
                    }
                    <fieldset className="row mb-3">
                        <div className="col-12 col-md-4 my-4 my-md-0">
                            <h4 className="h5 mb-0">Identity</h4>
                            <p className="text-muted mb-0"><small>About this release channel.</small></p>
                        </div>
                        <div className="col-12 col-md-8">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-12 col-lg-6">
                                            <div className="form-floating">
                                                <select className="form-select" id="channel_id" aria-label="Channel" value={curReleaseChannel.channel_id} onChange={formHandler}>
                                                    <option style={{ display: 'none' }}>Select channel</option>
                                                    {channels.map((channel, key) => (
                                                        <option value={channel.id} key={key}>{channel.name}</option>
                                                    ))}
                                                </select>
                                                <label htmlFor="channel_id">Channel</label>
                                            </div>
                                        </div>
                                        <div className="col-12 col-lg-6">
                                            <div className="form-floating">
                                                <select className="form-select" id="release_id" aria-label="Release" value={curReleaseChannel.release_id} onChange={formHandler}>
                                                    <option style={{ display: 'none' }}>Select release</option>
                                                    {releases.map((release, key) => (
                                                        <option value={release.id} key={key}>{release.name}</option>
                                                    ))}
                                                </select>
                                                <label htmlFor="release_id">Release</label>
                                            </div>
                                        </div>
                                        <div className="col-12 col-lg-6">
                                            <div className="form-floating">
                                                <input type="text" className="form-control" id="name" value={curReleaseChannel.name} onChange={formHandler} />
                                                <label htmlFor="name">Name</label>
                                            </div>
                                        </div>
                                        <div className="col-12 col-lg-6">
                                            <div className="form-floating">
                                                <input type="text" className="form-control" id="short_name" value={curReleaseChannel.short_name} onChange={formHandler} />
                                                <label htmlFor="short_name">Short name</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="row mb-3">
                        <div className="col-12 col-md-4 my-4 my-md-0">
                            <h4 className="h5 mb-0">Status</h4>
                            <p className="text-muted mb-0"><small>The platform's current status.</small></p>
                        </div>
                        <div className="col-12 col-md-8">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row g-2">
                                        <div className="col-12 col-lg-6">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value="1"
                                                    id="supported"
                                                    checked={curReleaseChannel.supported === 1}
                                                    onChange={formHandler}
                                                />
                                                <label className="form-check-label" htmlFor="supported">
                                                    Supported<br />
                                                    <p className="form-text">This release channel is still receiving updates.</p>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </form>
        </Admin>
    )
}