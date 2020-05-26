import React from 'react';
import VerticalRow from '~/components/VerticalRow';

import './style.scss';

const NotFound: React.FC = () => {
    return (
        <div className="NotFound">
            <div className="wrapper">
                <h3>404</h3>
                <VerticalRow />
                <h3>Page not found</h3>
            </div>
        </div>
    );
};

export default NotFound;
