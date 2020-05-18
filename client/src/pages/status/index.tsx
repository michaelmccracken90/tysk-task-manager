import React from "react";
import useAxios from "axios-hooks";

import "./style.scss";

const Status: React.FC = () => {
    const [{ data: status, loading, error }, refetch] = useAxios("/api/status");

    if (error) return <p>Error!</p>;
    return (
        <div className="Status">
            <header className="Status-header">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <p>
                            Response time: {Date.now() - status.timestamp}ms
                            <br />
                            Uptime: {status.uptime}s
                        </p>
                        <button onClick={() => refetch()}>Refetch</button>
                    </>
                )}
            </header>
        </div>
    );
};

export default Status;
