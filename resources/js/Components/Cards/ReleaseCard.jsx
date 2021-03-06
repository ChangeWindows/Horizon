import React, { useMemo } from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';

import PlatformIcon from '../Platforms/PlatformIcon';

import clsx from 'clsx';

export default function ReleaseCard({ name, platform, channels, alts, url, pack = false }) {
    const Component = useMemo(() => (url ? InertiaLink : 'div'), ['url']);
    const mainProps = useMemo(() => ({ href: url }), ['url']);

    return (
        <div className="col-12 col-sm-6 col-xl-4 col-xxl-3">
            <Component {...mainProps} className="card release">
                <div className="d-flex flex-row">
                    {platform && <h3 className="h6 mb-0"><PlatformIcon platform={platform} color /></h3>}
                    <div className={clsx({ 'ms-2': platform })}>
                        <h3 className="h6 mb-0">{name}</h3>
                        {!pack && alts && !platform?.tool && <p className="text-muted mb-0 mt-n1"><small>{alts.join(', ')}</small></p>}
                    </div>
                </div>
                <div className="flex-grow-1"></div>
                {channels && <div className="release-channels mt-3">
                    {channels.map((channel, key) => (
                        <span key={key} className="badge me-1" style={{ backgroundColor: channel.color }}>
                            {channel.short_name}
                        </span>
                    ))}
                </div>}
            </Component>
        </div>
    );
};