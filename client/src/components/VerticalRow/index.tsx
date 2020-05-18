import React from "react";

const VerticalRow: React.FC<{ height?: string; color?: string; width?: string }> = ({
    height = "50px",
    width = "1px",
    color = "#313131",
}) => {
    return (
        <div style={{ display: "inline-block", height, width, backgroundColor: color }} className="Hr"></div>
    );
};

export default VerticalRow;
