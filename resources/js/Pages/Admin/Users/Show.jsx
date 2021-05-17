import React from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';

import Admin from '../../../Layouts/Admin';
import NaviBar from '../../../Components/NaviBar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEye, faPen } from '@fortawesome/pro-regular-svg-icons';

export default function Show({ can, users, status = null }) {
    return (
        <Admin>
            <NaviBar>Users</NaviBar>
        
            <div className="container my-3">
                {status &&
                    <div className="alert alert-success"><FontAwesomeIcon icon={faCheck} fixedWidth /> {status}</div>
                }
                <div className="row g-3">
                    {users.map((user) => (
                        <div className="col-12 col-sm-6 col-xl-4 col-xxl-3" key={user.id}>
                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <h3 className="h6 mb-0">{user.name}</h3>
                                    <p className="text-muted mb-0 mt-n1"><small>{user.email}</small></p>
                                </div>
                                <div className="card-footer">
                                    <InertiaLink href={user.editUrl} className="btn btn-link btn-sm">
                                        {can.edit_users ? <><FontAwesomeIcon icon={faPen} fixedWidth /> Edit</> : <><FontAwesomeIcon icon={faEye} fixedWidth /> Show</>}
                                    </InertiaLink>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Admin>
    )
}