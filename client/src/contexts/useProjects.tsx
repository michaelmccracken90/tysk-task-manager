import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { ProjectsContextProps, Project } from '~/interfaces/api';
import useAuth from './useAuth';
import api from '~/services/axios';
import { useAlert } from 'react-alert';

const ProjectsContext = createContext<ProjectsContextProps>({} as ProjectsContextProps);

// TODO: Should remove, add and update the projects from `projects` Array instead call indexProjects

export const ProjectsProvider: React.FC = ({ children }) => {
    const [selectedProject, setSelectedProject] = useState({} as Project);
    const [projects, setProjects] = useState([] as Array<Project>);
    const [loading, setLoading] = useState(false);
    const { signed, login } = useAuth();
    const alert = useAlert();

    const indexProjects = useCallback(async () => {
        setLoading(true);
        const results = (await api.get(`/users/${login?.user.id}/projects`)).data as Array<Project>;

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
            if (title && title.length > 16) return alert.error('Title too long.');
            if (description && description.length > 16) return alert.error('Description too long.');
            setLoading(true);
            const results = (
                await api.post('/users/projects', {
                    title,
                    description,
                })
            ).data as Project;
            setLoading(false);
            await indexProjects();
            setSelectedProject(results);

            return results;
        },
        [indexProjects, alert],
    );

    const updateProjects = async (project: Project) => {
        if (project.title && project.title.length > 16) return alert.error('Title too long.');
        if (project.description && project.description.length > 126) return alert.error('Description too long.');
        setLoading(true);
        const results = (await api.put(`/users/${login?.user.id}/projects/${selectedProject.id}`, project)).data as {
            new: Project;
            old: Project;
        };

        setLoading(false);
        await indexProjects();

        setSelectedProject(results.new);

        return results;
    };

    const deleteProjects = useCallback(async () => {
        setLoading(true);
        const results = (await api.delete(`/users/projects/${selectedProject.id}`)).data as Project;

        setLoading(false);
        await indexProjects();

        return results;
    }, [selectedProject, indexProjects]);

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
