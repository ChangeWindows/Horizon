import React, { useMemo } from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';

import PlatformIcon from '../Platforms/PlatformIcon';
import clsx from 'clsx';

export default function Flight({ platform, build, channels, version = null, pack = null, url = null, overview = false, sidebar = false }) {
    const Component = useMemo(() => (url ? InertiaLink : 'div'), ['url']);
    const mainProps = useMemo(() => ({ href: url }), ['url']);
    console.log(overview, sidebar);

    return (
        <Component {...mainProps} className="event">
            <div className="icon">
                <PlatformIcon platform={platform} color />
            </div>
            <div className="revision">{build}</div>
            <div className={clsx('tags', { 'justify-content-end': sidebar })}>
                {channels.map((channel, key) => (
                    <span key={key} className="badge me-1" style={{ backgroundColor: channel.color }}>{channel.name}</span>
                ))}
            </div>
            <div className={
                clsx(
                    'version',
                    'text-muted',
                    {
                        'd-none': overview || sidebar,
                        'd-sm-block': overview && !sidebar || !sidebar
                    }
                )
            }>
                {platform.tool ? null : version ?? pack}
            </div>
        </Component>
    );
};