import React from "react";

import "./style.scss";
import { Task } from "~/interfaces/api";

interface TasksProps {
    task: Task;
    onAction?: (taskId: number, action: string, value?: any) => void
}

const TaskLI: React.FC<TasksProps> = ({
    task,
    onAction = () => {},
}) => {
    return (
        <div className="Task">
            <div className="Actions">
                <button
                    onClick={() => {
                        onAction(task.id || -1, 'changeCompleted', !task.completed);
                    }}
                >
                    <span
                        className={
                            task.completed ? "icon-check-circle" : "icon-circle-thin"
                        }
                    />
                </button>
                <div className="hided">
                    <button onClick={() => onAction(task.id || -1, 'edit', task)}><span className="icon-edit"></span></button>
                    <button onClick={() => onAction(task.id || -1, 'delete')}><span className="icon-delete"></span></button>
                </div>
            </div>
            {task.description}
        </div>
    );
};

export default TaskLI;
