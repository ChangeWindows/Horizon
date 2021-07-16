import React from 'react';
import { InertiaHead } from '@inertiajs/inertia-react';

import App from '../../Layouts/App';
import Channel from '../../Components/Cards/Channel';

import PlatformIcon from '../../Components/Platforms/PlatformIcon';
import PlatformNavigation from '../../Components/PlatformNavigation';

import { format, parseISO } from 'date-fns';
import clsx from 'clsx';

export default function Index({ app, platforms, channel_platforms }) {
    return (
        <App>
            <InertiaHead title="Channels" />

            <PlatformNavigation home all="/channels" page="Channels" platforms={platforms} />
        
            <div className="container">
                <div className="row g-1">
                    <div className="col-12 titlebar">
                        <h1>Channels</h1>
                    </div>
                    {channel_platforms.map((platform, key) => (
                        <div className={clsx({ 'col-12': platform.channels.length >= 3, 'col-12 col-md-6': platform.channels.length <= 2 })} key={key}>
                            <div className="row g-1">
                                <div className="col-12 titel">
                                    <h3 className="h6" style={{ color: platform.color }}>
                                        <PlatformIcon platform={platform} color />
                                        <span className="fw-bold ms-2">{platform.name}</span>
                                    </h3>
                                </div>
                                {platform.channels.map((channel, _key) => (
                                    <Channel
                                        key={_key}
                                        channel={{ color: channel.color, name: channel.name }}
                                        build={channel.flight ? channel.flight.version : ''}
                                        date={channel.flight ? format(parseISO(channel.flight.date), 'd MMMM yyyy') : ''}
                                        url={channel.flight ? channel.flight.url : undefined}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </App>
    )
}