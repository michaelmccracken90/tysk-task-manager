import React from 'react';

import './style.scss';

const Loading: React.FC = ({children}) => {
    return (
        <div className="Loading">
            <div className="loader"></div>
            {children}
        </div>
    );
};

export default Loading;
