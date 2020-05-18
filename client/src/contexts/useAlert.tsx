import React, { DetailedHTMLProps, HTMLAttributes } from "react";
import { positions, Provider, AlertComponentPropsWithStyle } from "react-alert";

const getColor = (type: string | undefined) => {
    switch (type) {
        case "error":
            return `#eb4034`;
        case "info":
            return `#3471eb`;
        case "success":
            return `#05ff16`;
    }
};

const alertStyle = {
    color: "#FFFEFE",
    borderRadius: "10px",
    padding: '20px',
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "-3px 3px 6px #00000029",
    width: "300px",
    boxSizing: "border-box",
    fontSize: "14px",
    position: "relative",
};

const messageStyle = {
    flex: 3,
    textAlign: "center",
    width: "100%",
};

interface PropStyle
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const AlertTemplate: React.FC<AlertComponentPropsWithStyle> = ({
    message,
    style,
    options
}) => (
    <div style={{ ...alertStyle, ...style, backgroundColor: getColor(options.type) } as PropStyle}>
        <div style={messageStyle as PropStyle}>{message}</div>
    </div>
);

const options = {
    timeout: 5000,
    position: positions.MIDDLE_LEFT,
};

export const AlertProvider: React.FC = ({ children }) => {
    return (
        <Provider template={AlertTemplate} {...options}>
            {children}
        </Provider>
    );
};
