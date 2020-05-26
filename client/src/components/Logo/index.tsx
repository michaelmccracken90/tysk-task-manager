import React from 'react';

import { ReactComponent as AppLogo } from '@assets/logo.svg';

type LogoProps = {
    width?: string;
    height?: string;
};

const Logo: React.FC<LogoProps> = ({ width = '', height = '50px' }: LogoProps) => {
    return (
        <div className="Logo">
            <AppLogo
                style={{
                    width,
                    height,
                }}
            />
        </div>
    );
};

export default Logo;
