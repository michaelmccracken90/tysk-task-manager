import React from 'react';

import './style.scss';

import Logo from '@components/Logo';
import useAuth from '~/contexts/useAuth';
import { Redirect } from 'react-router-dom';

type AuthLayoutProps = {
    onSubmit?: (event: React.FormEvent) => void;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, onSubmit }) => {
    const { signed } = useAuth();
    if (signed) return <Redirect to="/app" />;
    return (
        <div className="Auth">
            <form method="POST" onSubmit={onSubmit} className="AuthLayout">
                <Logo />
                {children}
            </form>
        </div>
    );
};

export default AuthLayout;
