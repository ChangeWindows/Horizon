import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink } from '@inertiajs/inertia-react';

import Auth from '../../Layouts/Auth';

import { faArrowRightToBracket, faShieldKeyhole } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Login({ can }) {
    const [form, setForm] = useState({ email: '', password: '', remember_me: true });

    function handleSubmit(event) {
      event.preventDefault();
      Inertia.post('/login', form);
    }

    return (
        <Auth can={can}>
            <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-12">
                    <div className="form-floating">
                        <input type="email" className="form-control" id="email" value={form.email} onChange={(event) => setForm((curLogin) => ({ ...curLogin, email: event.target.value }))} autoFocus />
                        <label htmlFor="email">Email</label>
                    </div>
                </div>
                <div className="col-12">
                    <div className="form-floating">
                        <input type="password" className="form-control" id="password" value={form.password} onChange={(event) => setForm((curLogin) => ({ ...curLogin, password: event.target.value }))} autocomplete="current-password" />
                        <label htmlFor="password">Password</label>
                    </div>
                </div>
                <div className="col-12">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            value="1"
                            id="remember_me"
                            name="remember_me"
                            checked={form.remember_me}
                            onChange={() => setForm((curLogin) => ({ ...curLogin, remember_me: !curLogin.remember_me }))}
                        />
                        <label className="form-check-label" htmlFor="remember_me">
                            <span className="fw-bold">Remember me</span>
                        </label>
                    </div>
                </div>
                <div className="col-12 d-flex justify-content-between">
                    <button className="btn btn-primary me-1" type="submit">
                        <FontAwesomeIcon icon={faArrowRightToBracket} fixedWidth /> Login
                    </button>
                    <InertiaLink href="/forgot-password" className="btn btn-link">
                        <FontAwesomeIcon icon={faShieldKeyhole} fixedWidth /> Forgot password
                    </InertiaLink>
                </div>
            </form>
        </Auth>
    )
}