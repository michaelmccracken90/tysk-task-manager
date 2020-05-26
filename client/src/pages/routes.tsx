import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import Landpage from './landpage';
import Status from './status';
import Login from './auth/login';
import Register from './auth/register';

import App from './app';
import NotFound from './notFound';

import { AuthProvider } from '../contexts/useAuth';
import { ProjectsProvider } from '../contexts/useProjects';
import { TasksProvider } from '../contexts/useTasks';

export default () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ProjectsProvider>
                    <TasksProvider>
                        <Switch>
                            <Route path="/" exact component={Landpage} />
                            <Route path="/app" exact component={App} />
                            <Route path="/login" exact component={Login} />
                            <Route path="/register" exact component={Register} />
                            <Route path="/status" exact component={Status} />
                            <Route path="/404" component={NotFound} />
                            <Redirect to="/404" />
                        </Switch>
                    </TasksProvider>
                </ProjectsProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};
