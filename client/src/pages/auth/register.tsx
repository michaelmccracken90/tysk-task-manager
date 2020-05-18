import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { Helmet } from "react-helmet";

import AuthLayout from "./layout";
import Input from "@components/Input";
import Button from "@components/Button";
import { useAuth } from "~/contexts/useAuth";

const Register: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const { signUp } = useAuth();
    const alert = useAlert();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!(username.length >= 4 && username.length <= 18)) {
            alert.error(
                "Username needs to be greater than 4 and less than 18."
            );
        } else if (!(password.length >= 6) || !(password.length <= 72)) {
            if (password.length <= 72) {
                alert.error("Password needs to be greater than 6.");
            } else {
                alert.error("Password is too big.");
            }
        } else if (password !== repeatPassword) {
            alert.error("Passwords needs to be equal.");
        } else {
            signUp(username, password);
        }
    };

    return (
        <AuthLayout onSubmit={handleSubmit}>
            <Helmet>
                <title>Tysk - Register</title>
            </Helmet>
            <h3>Create your account</h3>
            <Input
                className="no-margin"
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                required
            />
            <Input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
            />
            <Input
                type="password"
                name="repeatPassword"
                placeholder="Repeat password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.currentTarget.value)}
                required
            />
            <Button className="primary auth-action" type="submit">
                Sign-up
            </Button>
            <Link to="/login">
                <Button className="secondary" type="button">
                    Already have an account?
                </Button>
            </Link>
        </AuthLayout>
    );
};

export default Register;
