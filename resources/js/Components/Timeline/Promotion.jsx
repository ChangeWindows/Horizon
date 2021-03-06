import React, { useMemo } from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';

import PlatformIcon from '../Platforms/PlatformIcon';
import clsx from 'clsx';

export default function Promotion({ platform, version, channel, url, overview = false }) {
    const Component = useMemo(() => (url ? InertiaLink : 'div'), ['url']);
    const mainProps = useMemo(() => ({ href: url }), ['url']);

    return (
        <Component {...mainProps} className="event">
            <div className="icon">
                <PlatformIcon platform={platform} color />
            </div>
            <div className="revision">
                Version <span className="fw-bold">{version}</span>
            </div>
            <div className="tags">
                <span className="badge me-1" style={{ backgroundColor: channel.color }}>{channel.name}</span>
            </div>
            <div className={clsx('version', 'text-muted', { 'd-none': overview, 'd-sm-block': overview })}>{version ?? component}</div>
        </Component>
    )
};