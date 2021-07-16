import React, { useMemo } from 'react';
import { InertiaHead } from '@inertiajs/inertia-react';

import App from '../../Layouts/App';
import Channel from '../../Components/Cards/Channel';
import ReleaseCard from '../../Components/Cards/ReleaseCard';

import PlatformIcon from '../../Components/Platforms/PlatformIcon';
import PlatformNavigation from '../../Components/PlatformNavigation';

import { format, parseISO } from 'date-fns';

export default function Show({ app, platforms, platform, channels, releases, packages }) {
    const [currentReleases, legacyReleases] = useMemo(() => {
        const currentReleases = releases.filter((release) => release.channels.length > 0);
        const legacyReleases = releases.filter((release) => release.channels.length === 0);

        return [currentReleases, legacyReleases];
    }, [releases]);

    return (
        <App>
            <InertiaHead title={platform.name} />

            <PlatformNavigation page="Platforms" platforms={platforms} />
        
            <div className="container">
                <div className="row g-3">
                    <div className="col-12 titlebar">
                        <h1  style={{ color: platform.color }}><PlatformIcon platform={platform} color className="me-2" /> {platform.name}</h1>
                        <p className="mb-0 mt-1">{platform.description}</p>
                    </div>

                    {channels.length >= 1 &&
                        <div className="col-12">
                            <h2 className="h5 mb-3 fw-bold">Channels</h2>
                            <div className="row g-1">
                                {channels.map((channel, key) => (
                                    <Channel
                                        key={key}
                                        channel={{ color: channel.color, name: channel.name }}
                                        build={channel.flights.length > 0 ? channel.flights[0].version : ''}
                                        date={channel.flights.length > 0 ? format(parseISO(channel.flights[0].date), 'd MMMM yyyy') : ''}
                                        url={channel.flights.length > 0 ? channel.flights[0].url : undefined}
                                    />
                                ))}
                            </div>
                        </div>
                    }
                    <div className="col-12">
                        <div className="row">
                            {currentReleases.length > 0 &&
                                <div className="col-12 mt-4">
                                    <h2 className="h5 mb-3 fw-bold">Current releases</h2>
                                    <div className="row g-1">
                                        {currentReleases.map((release, key) => {
                                            return (
                                                <ReleaseCard
                                                    key={key}
                                                    platform={platform}
                                                    name={release.name}
                                                    alts={[`Version ${release.version}`, release.codename]}
                                                    channels={release.channels}
                                                    url={release.url}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            }
                            {packages.length > 0 &&
                                <div className="col-12 mt-4">
                                    <h2 className="h5 mb-3 fw-bold">Packages</h2>
                                    <div className="row g-1">
                                        {packages.map((pack, key) => {
                                            return (
                                                <ReleaseCard
                                                    key={key}
                                                    pack
                                                    platform={platform}
                                                    name={pack.name}
                                                    alts={[`Version ${pack.version}`, pack.codename]}
                                                    channels={pack.channels}
                                                    url={pack.url}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            }
                            {legacyReleases.length > 0 &&
                                <div className="col-12 mt-4">
                                    <h2 className="h5 mb-3 fw-bold">Unsupported releases</h2>
                                    <div className="row g-1">
                                        {legacyReleases.map((release, key) => {
                                            return (
                                                <ReleaseCard
                                                    key={key}
                                                    platform={platform}
                                                    name={release.name}
                                                    alts={[`Version ${release.version}`, release.codename]}
                                                    url={release.url}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </App>
    )
}