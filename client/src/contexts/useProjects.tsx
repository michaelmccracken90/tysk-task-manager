import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useCallback,
} from 'react';
import { ProjectsContextProps, Project } from '~/interfaces/api';
import useAuth from './useAuth';
import api from '~/services/axios';
import { useAlert } from 'react-alert';

const ProjectsContext = createContext<ProjectsContextProps>(
    {} as ProjectsContextProps
);

export const ProjectsProvider: React.FC = ({ children }) => {
    const [selectedProject, setSelectedProject] = useState({} as Project);
    const [projects, setProjects] = useState([] as Array<Project>);
    const [loading, setLoading] = useState(false);
    const { signed, login } = useAuth();
    const alert = useAlert();

    const indexProjects = useCallback(async () => {
        setLoading(true);
        const results = (await api.get(`/users/${login?.user.id}/projects`))
            .data as Array<Project>;

        if (results.length >= 1) setSelectedProject(results[0]);

        setLoading(false);
        setProjects(results);

        return results;
    }, [login]);

    useEffect(() => {
        signed && indexProjects();
    }, [signed, indexProjects]);

    const createProjects = useCallback(
        async (title: string, description: string) => {
            if (title && title.length > 25)
                return alert.error('Title too long.');
            if (description && description.length > 126)
                return alert.error('Description too long.');

            setLoading(true);

            const results = (
                await api.post('/users/projects', {
                    title,
                    description,
                })
            ).data as Project;

            setProjects((p) => [...p, results]);

            setLoading(false);

            setSelectedProject(results);
        },
        [alert]
    );

    const updateProjects = async (project: Project) => {
        if (
            project.title.replace(/\s/g, '').length < 3 ||
            project.title.length > 25
        )
            return alert.error('Title too long or too short.');
        if (project.description && project.description.length > 126)
            return alert.error('Description too long.');

        setProjects(
            projects.map((indexedProject) => {
                if (selectedProject.id === indexedProject.id) {
                    const updatedProject = {
                        ...indexedProject,
                        title: project.title,
                        description: project.description,
                    };

                    setSelectedProject(updatedProject);

                    return updatedProject;
                }
                return indexedProject;
            })
        );

        api.put(
            `/users/${login?.user.id}/projects/${selectedProject.id}`,
            project
        );
    };

    const deleteProjects = useCallback(async () => {
        setProjects(
            projects.filter(
                (indexedProject) => selectedProject.id !== indexedProject.id
            )
        );
        setSelectedProject(projects[0]);
        api.delete(`/users/projects/${selectedProject.id}`);
    }, [projects, selectedProject, setProjects, setSelectedProject]);

    return (
        <ProjectsContext.Provider
            value={{
                selectedProject,
                projects,
                loading,
                setSelectedProject,
                indexProjects,
                createProjects,
                updateProjects,
                deleteProjects,
            }}
        >
            {children}
        </ProjectsContext.Provider>
    );
};

export const useProjects = () => {
    const context = useContext(ProjectsContext);
    return context;
};

export default useProjects;
