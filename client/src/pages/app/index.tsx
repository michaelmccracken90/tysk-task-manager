import React, { useState, useCallback, useEffect } from 'react';
import { useWindowSize } from '@react-hook/window-size';
import { Scrollbars } from 'react-custom-scrollbars';

import './style.scss';

import { useAuth } from '~/contexts/useAuth';
import Input from '~/components/Input';
import useProjects from '~/contexts/useProjects';
import ProjectButton from '~/components/ProjectButton';
import Modal from '~/components/Modal';
import Button from '~/components/Button';
import useTasks from '~/contexts/useTasks';
import TaskLI from '~/components/Task';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loading from '../loading';

// TODO: Add search by task or project

const App: React.FC = () => {
    useEffect(() => {
        window.localStorage.setItem('previouslyVisited', 'true');
    }, []);

    const { signed, login, signOut } = useAuth();

    // #region tasks and projects import
    const {
        projects,
        selectedProject,
        createProjects,
        updateProjects,
        deleteProjects,
        loading: projectsLoading,
    } = useProjects();

    const { tasks, updateTasks, deleteTasks, createTasks, loading: tasksLoading } = useTasks();
    // #endregion

    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [tasksDescription, setTasksDescription] = useState('');

    // #region Editing projects / tasks
    const [editing, setEditing] = useState({
        project: false,
        task: false as boolean | number,
    });

    const [editingValues, setEditingValues] = useState({
        project: {
            title: '',
            description: '',
        },
        task: {
            description: '',
        },
    });

    const onChangeEditing = useCallback(
        (editingName: 'project' | 'task', value: {}) => {
            setEditingValues((previousEditingValues) => ({
                ...previousEditingValues,
                [editingName]: {
                    ...previousEditingValues[editingName],
                    ...value,
                },
            }));
        },
        [setEditingValues],
    );

    const stopEditing = (editingName: 'project' | 'task') => {
        if (editingName === 'project') updateProjects(editingValues.project);
        else if (editing.task)
            updateTasks({
                description: editingValues.task.description,
                id: editing.task as number,
            });

        setEditing((previousEditing) => ({
            ...previousEditing,
            [editingName]: false,
        }));
    };

    const startEditing = useCallback(
        (editingName: 'project' | 'task', defaultValue: {}, taskId?: number) => {
            onChangeEditing(editingName, defaultValue);
            setEditing((previousEditing) => ({
                ...previousEditing,
                [editingName]: editingName === 'project' ? true : taskId,
            }));
        },
        [setEditing, onChangeEditing],
    );
    // #endregion

    const onTaskAction = useCallback(
        (taskId: number, action: string, value?: any) => {
            if (taskId < 0) return;

            switch (action) {
                case 'changeCompleted':
                    value !== null && updateTasks({ id: taskId, completed: value });
                    break;

                case 'delete':
                    deleteTasks(taskId);
                    break;

                case 'edit':
                    startEditing('task', { description: value.description }, taskId);
                    break;

                default:
                    break;
            }
        },
        [startEditing, updateTasks, deleteTasks],
    );

    // #region Modals
    const [hiddenModals, setHiddenModals] = useState({
        moreProjects: true,
        addProjects: true,
        addTasks: true,
        options: true,
    });

    const openModal = (modalName: string) => {
        setHiddenModals((previousHiddenModals) => ({
            ...previousHiddenModals,
            [modalName]: false,
        }));
    };

    const closeModal = (modalName: string) => {
        setHiddenModals((previousHiddenModals) => ({
            ...previousHiddenModals,
            [modalName]: true,
        }));
    };

    const modalCallbacks = {
        closeAddProjects: useCallback(() => closeModal('addProjects'), []),
        openAddProjects: useCallback(() => openModal('addProjects'), []),
        closeMoreProjects: useCallback(() => closeModal('moreProjects'), []),
        openMoreProjects: useCallback(() => openModal('moreProjects'), []),
        closeAddTasks: useCallback(() => closeModal('addTasks'), []),
        openAddTasks: useCallback(() => openModal('addTasks'), []),

        openOptions: useCallback(() => openModal('options'), []),
        closeOptions: useCallback(() => closeModal('options'), []),
    };
    // #endregion

    // #region Number of projects displayed
    const [width, height] = useWindowSize();

    const getProjectsDisplayed = useCallback(() => {
        const math = Math.floor(width / (width > 1200 ? 350 : width < 680 ? 150 : 300)) * Math.floor(height / 300) - 2;
        return math >= 0 ? math : 0;
    }, [width, height]);

    const [projectsDisplayed, setProjectsDisplayed] = useState(getProjectsDisplayed);

    useEffect(() => setProjectsDisplayed(getProjectsDisplayed), [getProjectsDisplayed, width, height]);
    // #endregion

    const paginate = (array: Array<any>, page_size: number = 6, page_number: number = 1) => {
        return page_size > array.length ? array : array.slice((page_number - 1) * page_size, page_number * page_size);
    };

    if (!signed && !window.localStorage.getItem('token')) {
        window.localStorage.setItem('token', '');
        return <Redirect to="/login" />;
    }

    return (
        <div className="App">
            <Helmet>
                <title>Tysk - App</title>
            </Helmet>

            <div className="Apresentation">
                <div className="Options">
                    <button onClick={modalCallbacks.openOptions}>
                        <span className="icon-menu"></span>
                    </button>
                    <div className="float-menu">
                        <Modal hidden={hiddenModals.options} display="flex" onCloseModal={modalCallbacks.closeOptions}>
                            <button onClick={() => signOut()}>
                                <span className="icon-logout"></span> Logout
                            </button>
                        </Modal>
                    </div>
                </div>
                <p className="username">Hi {login?.user.username}</p>
                <p>Welcome back to the workspace, we missed you!</p>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Input
                        type="text"
                        name="search"
                        onChange={() => {}}
                        value=""
                        required
                        placeholder="Search Task or Project..."
                        disabled
                    />
                </form>
            </div>

            <div className="ProjectsContainer">
                {projectsLoading && <Loading />}
                <p>Projects</p>
                <Modal
                    display="flex"
                    className="addProjects"
                    hidden={hiddenModals.addProjects}
                    onCloseModal={modalCallbacks.closeAddProjects}
                >
                    <h4>Create new project</h4>
                    <hr />
                    <Input
                        autoFocus
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="projectName"
                        type="text"
                        placeholder="Amazing project"
                    />
                    <Input
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        className="projectDescription"
                        type="text"
                        placeholder="This is my amazing project"
                    />
                    <Button
                        onClick={() => {
                            if (projectName.length > 2) {
                                createProjects(projectName, projectDescription);
                                setProjectName('');
                                setProjectDescription('');
                                closeModal('addProjects');
                            }
                        }}
                        className="primary addProject"
                        type="reset"
                    >
                        Add project
                    </Button>
                </Modal>
                <Modal
                    className="moreProjects"
                    hidden={hiddenModals.moreProjects}
                    onCloseModal={modalCallbacks.closeMoreProjects}
                >
                    <Scrollbars>
                        <h4>More {projects.length - projectsDisplayed} projects</h4>
                        <div className="Projects">
                            {projects.slice(projectsDisplayed).map((project, index) => (
                                <ProjectButton type="normal" project={project} key={index} />
                            ))}
                        </div>
                    </Scrollbars>
                </Modal>
                <div
                    className="Projects"
                    style={{
                        gridTemplateColumns: `repeat(${
                            Math.floor(width / (width > 1200 ? 350 : width < 680 ? 150 : 300)) || 1
                        }, auto)`,
                    }}
                >
                    {projects.length > projectsDisplayed + 1
                        ? paginate(projects, projectsDisplayed)
                              .map((project, index) => <ProjectButton type="normal" project={project} key={index} />)
                              .concat(
                                  <ProjectButton
                                      key={projects.length}
                                      type="list"
                                      quantity={projects.length - projectsDisplayed}
                                      onClick={modalCallbacks.openMoreProjects}
                                  />,
                              )
                        : projects.map((project, index) => (
                              <ProjectButton type="normal" project={project} key={index} />
                          ))}
                    <Button
                        type="box"
                        className="Project"
                        boxIcon={<span className="icon-plus" />}
                        onClick={modalCallbacks.openAddProjects}
                    >
                        New project
                    </Button>
                </div>
            </div>

            <div style={tasks.length >= 1 ? {} : { justifyContent: 'center', alignItems: 'center' }} className="Todos">
                {tasksLoading && <Loading />}
                {projects.length >= 1 ? (
                    <>
                        <Modal
                            hidden={hiddenModals.addTasks}
                            onCloseModal={modalCallbacks.closeAddTasks}
                            display="flex"
                            className="addTasks"
                        >
                            <h4>New task</h4>
                            <hr />
                            <Input
                                value={tasksDescription}
                                onChange={(e) => setTasksDescription(e.target.value)}
                                className="taskDescription"
                                type="text"
                                placeholder="Make something great"
                            />
                            <Button
                                onClick={() => {
                                    if (tasksDescription.length > 2) {
                                        createTasks(tasksDescription);
                                        setTasksDescription('');
                                        closeModal('addTasks');
                                    }
                                }}
                                className="primary addTasks"
                                type="reset"
                            >
                                Add
                            </Button>
                        </Modal>
                        <div className="Project" style={tasks.length < 1 ? { textAlign: 'center' } : {}}>
                            <p className="title">
                                {editing.project ? (
                                    <Input
                                        type="text"
                                        className="input--edit-text"
                                        autoFocus
                                        onBlur={() =>
                                            setTimeout(() => {
                                                !document.activeElement?.classList.contains('input--edit-text') &&
                                                    stopEditing('project');
                                            }, 50)
                                        }
                                        value={editingValues.project.title}
                                        onChange={(e) => {
                                            onChangeEditing('project', {
                                                title: e.target.value,
                                            });
                                        }}
                                    />
                                ) : (
                                    selectedProject.title
                                )}
                                {!editing.project && (
                                    <span className="Actions">
                                        <button
                                            onClick={() =>
                                                startEditing('project', {
                                                    title: selectedProject.title,
                                                    description: selectedProject.description,
                                                })
                                            }
                                        >
                                            <span className="icon-edit"></span>
                                        </button>
                                        <button
                                            onClick={() =>
                                                window.confirm('Are you sure you want to delete this project?') &&
                                                deleteProjects()
                                            }
                                        >
                                            <span className="icon-delete"></span>
                                        </button>
                                    </span>
                                )}
                            </p>
                            <div className="description">
                                {editing.project ? (
                                    <Input
                                        type="text"
                                        className="input--edit-text"
                                        onBlur={() =>
                                            setTimeout(() => {
                                                !document.activeElement?.classList.contains('input--edit-text') &&
                                                    stopEditing('project');
                                            }, 50)
                                        }
                                        value={editingValues.project.description}
                                        onChange={(e) => {
                                            onChangeEditing('project', {
                                                description: e.target.value,
                                            });
                                        }}
                                    />
                                ) : (
                                    selectedProject.description
                                )}
                            </div>
                        </div>
                        {tasks.length >= 1 ? (
                            <Scrollbars autoHide style={{ marginBottom: '-80px' }}>
                                <div className="NotCompleted">
                                    <p>Todo</p>
                                    <hr />
                                    <div className="Tasks">
                                        {tasks
                                            .filter((task) => !task.completed)
                                            .map((task, index) =>
                                                editing.task && task.id === editing.task ? (
                                                    <Input
                                                        autoFocus
                                                        type="text"
                                                        className="input--edit-text"
                                                        key={index}
                                                        onBlur={() =>
                                                            setTimeout(() => {
                                                                !document.activeElement?.classList.contains(
                                                                    'input--edit-text',
                                                                ) && stopEditing('task');
                                                            }, 50)
                                                        }
                                                        value={editingValues.task.description}
                                                        onChange={(e) => {
                                                            onChangeEditing('task', {
                                                                description: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                ) : (
                                                    <TaskLI key={index} task={task} onAction={onTaskAction} />
                                                ),
                                            )}
                                    </div>
                                </div>
                                <div className="Completed">
                                    <p>Completed</p>
                                    <hr />
                                    <div className="Tasks">
                                        {tasks
                                            .filter((task) => task.completed)
                                            .map((task, index) =>
                                                editing.task && task.id === editing.task ? (
                                                    <Input
                                                        autoFocus
                                                        type="text"
                                                        className="input--edit-text"
                                                        key={index}
                                                        onBlur={() =>
                                                            setTimeout(() => {
                                                                !document.activeElement?.classList.contains(
                                                                    'input--edit-text',
                                                                ) && stopEditing('task');
                                                            }, 50)
                                                        }
                                                        value={editingValues.task.description}
                                                        onChange={(e) => {
                                                            onChangeEditing('task', {
                                                                description: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                ) : (
                                                    <TaskLI key={index} task={task} onAction={onTaskAction} />
                                                ),
                                            )}
                                    </div>
                                </div>
                            </Scrollbars>
                        ) : (
                            <span>Start by adding some tasks.</span>
                        )}
                        <Button
                            type="box"
                            onClick={modalCallbacks.openAddTasks}
                            boxStyle={{
                                width: '35px',
                                height: '35px',
                                borderRadius: '10px',
                            }}
                            boxIcon={<span className="icon-plus" />}
                        />
                    </>
                ) : (
                    <span>Create a new project!</span>
                )}
            </div>
        </div>
    );
};

export default App;
