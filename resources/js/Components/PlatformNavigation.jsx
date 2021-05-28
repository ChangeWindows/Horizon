import React, { useMemo } from 'react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';

import DropdownItem from './Navbar/DropdownItem';
import NavItem from './Navbar/NavItem';

import PlatformIcon from './Platforms/PlatformIcon';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faEllipsis } from '@fortawesome/pro-regular-svg-icons';

/* -- Utilities -- */
import useMediaQuery from '../hooks/useMediaQuery';
import clsx from 'clsx';

export default function Navigation({ home = false, platforms, all = false }) {
	const matchesSmUp = useMediaQuery('(min-width: 576px)');
    const page = usePage();
    
    const mainPlatforms = useMemo(() => platforms.filter((platform) => matchesSmUp && !platform.legacy || !matchesSmUp && !platform.legacy && !platform.tool), [matchesSmUp, platforms]);
    const legacyPlatforms = useMemo(() => platforms.filter((platform) => platform.legacy), [platforms]);
    const toolPlatforms = useMemo(() => platforms.filter((platform) => platform.tool), [platforms]);

    const isActiveOverflow = useMemo(() => {
        if (matchesSmUp) {
            return !!legacyPlatforms.find((platform) => page.url.includes(platform.url));
        }

        return !![...legacyPlatforms, ...toolPlatforms].find((platform) => page.url.includes(platform.url));
    }, [matchesSmUp, legacyPlatforms, toolPlatforms]);

    return (
        <nav className="navbar navbar-expand navbar-light sticky-top">
            <div className="container">
                <div className="collapse navbar-collapse" id="navbar-page">
                    <ul className="navbar-nav me-auto">
                        {all &&
                            <li className="nav-item">
                                <InertiaLink className={clsx('nav-link', { 'active': home })} href={all}>
                                    All
                                </InertiaLink>
                            </li>
                        }
                        {mainPlatforms.map((platform, key) => (
                            <NavItem url={platform.url} key={key}>
                                <PlatformIcon platform={platform} /> <span className="d-none d-xl-inline-block">{platform.name}</span>
                            </NavItem>
                        ))}
                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                            <a className={clsx('nav-link dropdown-toggle', { 'active': isActiveOverflow })} href="#" id="legacyPlatforms" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <span className="d-none d-sm-inline-block"><FontAwesomeIcon icon={faAngleDown} /> Legacy</span>
                                <span className="d-inline-block d-sm-none"><FontAwesomeIcon icon={faEllipsis} /></span>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="legacyPlatforms">
                                {!matchesSmUp && toolPlatforms.length > 0 &&
                                    <>
                                        <li><h6 className="dropdown-header">Tools</h6></li>
                                        {toolPlatforms.map((platform, key) => (
                                            <DropdownItem url={platform.url} key={key}>
                                                <PlatformIcon platform={platform} /> {platform.name}
                                            </DropdownItem>
                                        ))}
                                    </>
                                }
                                {!matchesSmUp && legacyPlatforms.length > 0 && <li><h6 className="dropdown-header">Legacy</h6></li>}
                                {legacyPlatforms.map((platform, key) => (
                                    <DropdownItem url={platform.url} key={key}>
                                        <PlatformIcon platform={platform} /> {platform.name}
                                    </DropdownItem>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}