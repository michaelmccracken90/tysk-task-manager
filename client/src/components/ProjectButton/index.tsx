import React from "react";

import "./style.scss";
import { Project } from "~/interfaces/api";
import useProjects from "~/contexts/useProjects";

interface ProjectButtonProps {
    type: "normal" | "list";
    project?: Project;
    quantity?: number;
    onClick?: (event: React.MouseEvent) => void;
}

const getProjectInitials = (projectName: string) => {
    const splitedName = projectName.replace(/\s+/gm, " ").trim().split(" ");
    return splitedName.length > 1
        ? splitedName[0][0] + splitedName[1][0]
        : projectName[0];
};

const gradients = [
    ["hsl(117, 93%, 63%)", "hsl(107, 93%, 78%)"],
    ["hsl(211, 91%, 74%)", "hsl(197, 96%, 75%)"],
    ["hsl(171, 97%, 65%)", "hsl(118, 94%, 71%)"],
    ["hsl(92, 90%, 61%)", "hsl(82, 96%, 79%)"],
    ["hsl(128, 97%, 60%)", "hsl(154, 91%, 77%)"],
    ["hsl(91, 95%, 63%)", "hsl(65, 95%, 74%)"],
    ["hsl(200, 90%, 77%)", "hsl(12, 90%, 72%)"],
    ["hsl(137, 90%, 70%)", "hsl(217, 93%, 64%)"],
    ["hsl(99, 95%, 62%)", "hsl(52, 98%, 78%)"],
    ["hsl(230, 96%, 72%)", "hsl(175, 98%, 75%)"],
    ["hsl(5, 94%, 61%)", "hsl(66, 90%, 67%)"],
    ["hsl(198, 92%, 72%)", "hsl(18, 96%, 66%)"],
    ["hsl(241, 98%, 77%)", "hsl(156, 99%, 64%)"],
    ["hsl(112, 91%, 60%)", "hsl(228, 96%, 78%)"],
    ["hsl(162, 95%, 60%)", "hsl(57, 92%, 61%)"],
    ["hsl(99, 96%, 75%)", "hsl(249, 99%, 66%)"],
    ["hsl(139, 99%, 77%)", "hsl(58, 93%, 77%)"],
    ["hsl(120, 94%, 76%)", "hsl(230, 94%, 63%)"],
];

const ProjectButton: React.FC<ProjectButtonProps> = ({
    type = "normal",
    project = { title: "", description: "" },
    quantity = 0,
    onClick,
}: ProjectButtonProps) => {
    const { setSelectedProject } = useProjects();

    switch (type) {
        case "normal":
            const boxGradient = gradients[project.title.length];

            const handleClick = (event: React.MouseEvent) => {
                event.preventDefault();
                setSelectedProject(project);
                onClick && onClick(event);
            };

            return (
                <button onClick={handleClick} className="Project">
                    <div
                        className="box"
                        style={{
                            background: `transparent
                    linear-gradient(226deg, ${boxGradient[0]} 0%, ${boxGradient[1]} 100%) 0% 0% no-repeat
                    padding-box`,
                        }}
                    >
                        {getProjectInitials(project.title.toUpperCase())}
                    </div>
                    <div className="title">{project.title}</div>
                </button>
            );

        case "list":
            return (
                <button onClick={onClick} className="Project">
                    <div style={{ backgroundColor: "#313131" }} className="box">
                        + {quantity}
                    </div>
                    <div className="title">More {quantity}</div>
                </button>
            );

        default:
            break;
    }
    return <></>;
};

export default ProjectButton;
