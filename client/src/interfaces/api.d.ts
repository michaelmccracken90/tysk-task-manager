export interface Project {
    id?: number;
    title: string;
    description?: string;
    user_id?: number;
    created_at?: string;
    updated_at?: string;
}

export interface ProjectsContextProps {
    selectedProject: Project;
    projects: Array<Project>;
    loading: Boolean;

    setSelectedProject(project: Project): void;

    indexProjects(): Promise;
    createProjects(title: string, description: string): Promise;
    updateProjects(newProjectData: Project): Promise;
    deleteProjects(): Promise;
}

export interface Task {
    id?: number;
    description?: string;
    project_id?: number;
    completed?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface TasksContextProps {
    tasks: Array<Task>;
    loading: Boolean;

    indexTasks(): Promise;
    createTasks(description: string): Promise;
    updateTasks(task: Task): Promise;
    deleteTasks(taskId: number): Promise;
}
