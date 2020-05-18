import React from "react";
import { Link } from "react-router-dom";

import "./style.scss";

import Logo from "@components/Logo";
import Button from "~/components/Button";

const Landpage: React.FC = () => {
    const previouslyVisited = window.localStorage.getItem("previouslyVisited");

    return (
        <>
            <div className="hero">
                <Logo />
                <h1>
                    Start making progress.
                    <Link
                        title="Register or Login"
                        to={previouslyVisited ? "/login" : "/register"}
                    >
                        <Button
                            className="primary"
                            style={{ fontSize: "2.3vw", marginLeft: "20px", padding: '15px 70px' }}
                            type="button"
                        >
                            {previouslyVisited ? "Sign-in" : "Sign-up"}
                        </Button>
                    </Link>
                </h1>
            </div>
        </>
    );
};

export default Landpage;
