import React from "react";

import "./style.scss";

type ButtonProps = {
    type: "submit" | "reset" | "button" | "box";
    className?: string;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    style?: React.CSSProperties;
    boxStyle?: React.CSSProperties;
    boxIcon?: React.ReactNode
};

const Button: React.FC<ButtonProps> = ({
    children,
    type,
    className = "",
    disabled = false,
    onClick = () => {},
    style = {},
    boxStyle = {},
    boxIcon
}) => {
    switch (type) {
        case "box":
            return (
                <button
                    className={`Button ${className} box`}
                    onClick={onClick}
                    type="button"
                    disabled={disabled}
                    style={style}
                >
                    <div className="box" style={boxStyle}>{boxIcon && boxIcon}</div>
                    <div className="title">{children}</div>
                </button>
            );

        default:
            return (
                <button
                    className={`Button ${className}`}
                    onClick={onClick}
                    type={type}
                    disabled={disabled}
                    style={style}
                >
                    {children}
                </button>
            );
    }
};

export default Button;
