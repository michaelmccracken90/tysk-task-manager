import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useCallback,
} from 'react';
import { TasksContextProps, Task } from '~/interfaces/api';
import useAuth from './useAuth';
import api from '~/services/axios';
import useProjects from './useProjects';
import { useAlert } from 'react-alert';

const TasksContext = createContext<TasksContextProps>({} as TasksContextProps);

export const TasksProvider: React.FC = ({ children }) => {
    const { signed, login } = useAuth();
    const { selectedProject } = useProjects();
    const [tasks, setTasks] = useState([] as Array<Task>);
    const [loading, setLoading] = useState(false);
    const alert = useAlert();

    const indexTasks = useCallback(async () => {
        if (!selectedProject) return [];

        setLoading(true);

        const results = (
            await api.get(
                `/users/${login?.user.id}/projects/${selectedProject.id}/tasks`
            )
        ).data as Array<Task>;

        setTasks(results);
        setLoading(false);

        return results;
    }, [login, selectedProject]);

    useEffect(() => {
        signed && selectedProject.id && indexTasks();
    }, [signed, indexTasks, selectedProject]);

    const createTasks = useCallback(
        async (description: string) => {
            if (description.length > 64) return alert.error('Task too long.');
            setLoading(true);

            const results = (
                await api.post(
                    `/users/${login?.user.id}/projects/${selectedProject.id}/tasks`,
                    {
                        description,
                    }
                )
            ).data as Array<Task>;

            setTasks((tasks) => [...tasks, results[0]]);

            setLoading(false);

            return results;
        },
        [selectedProject, login, alert]
    );

    const updateTasks = useCallback(
        async (task: Task) => {
            if (task.description && task.description.length > 64)
                return alert.error('Task too long.');

            setTasks((tasks) =>
                tasks.map((indexedTask) => {
                    if (indexedTask.id === task.id) {
                        return {
                            ...indexedTask,
                            ...task,
                        };
                    }

                    return indexedTask;
                })
            );

            api.put(
                `/users/${login?.user.id}/projects/${selectedProject.id}/tasks/${task.id}`,
                {
                    description: task.description,
                    completed: task.completed || false,
                }
            );
        },
        [login, selectedProject, alert, setTasks]
    );

    const deleteTasks = async (taskId: number) => {
        setTasks((tasks) => tasks.filter((task) => task.id !== taskId));

        api.delete(
            `/users/${login?.user.id}/projects/${selectedProject.id}/tasks/${taskId}`
        );
    };

    return (
        <TasksContext.Provider
            value={{
                tasks,
                loading,
                indexTasks,
                createTasks,
                updateTasks,
                deleteTasks,
            }}
        >
            {children}
        </TasksContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TasksContext);
    return context;
};

export default useTasks;
