import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import '@assets/icons.css';
import Routes from '@pages/routes';
import * as serviceWorker from './serviceWorker';
import { AlertProvider } from './contexts/useAlert';
// import { AuthProvider } from "./contexts/useAuth";
// import { ProjectsProvider } from "./contexts/useProjects";
// import { TasksProvider } from "./contexts/useTasks";

ReactDOM.render(
    <React.StrictMode>
        <AlertProvider>
            {/* <AuthProvider>
                <ProjectsProvider>
                    <TasksProvider> */}
            <Routes />
            {/* </TasksProvider>
                </ProjectsProvider>
            </AuthProvider> */}
        </AlertProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
