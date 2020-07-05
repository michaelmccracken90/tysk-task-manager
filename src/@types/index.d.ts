export interface HttpErrorHandler {
    status?: number;
    message?: string;
}

export interface NextErrorFunction {
    (err?: HttpErrorHandler): void;
}

export interface Project {
    id: number;
    user_id: number;
    title: string;
    description: string;
}

export interface User {
    id?: number;
    username?: string;
    password?: string;
    created_at?: string;
    updated_at?: string;
}
