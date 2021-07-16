import React, { useMemo } from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';

import PlatformIcon from '../Platforms/PlatformIcon';
import clsx from 'clsx';

export default function Launch({ platform, version, url = null, overview = false, sidebar = false }) {
    const Component = useMemo(() => (url ? InertiaLink : 'div'), ['url']);
    const mainProps = useMemo(() => ({ href: url }), ['url']);

    return (
        <Component {...mainProps} className="event text-white" style={{ background: platform.color}}>
            <div className="icon">
                <PlatformIcon platform={platform} />
            </div>
            <div className="message">Version <span className="fw-bold">{version}</span> is now flighting</div>
            <div className={
                clsx(
                    'version',
                    {
                        'd-none': overview || sidebar,
                        'd-sm-block': overview && !sidebar || !sidebar
                    }
                )
            }>
                {version}
            </div>
        </Component>
    );
};