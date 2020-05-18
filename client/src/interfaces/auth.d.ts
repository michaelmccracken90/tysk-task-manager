import Login from "./login";

export default interface AuthContextProps {
    signed: boolean;
    login: Login | null;
    loading: boolean;
    signIn(username: string, password: string): Promise<Login | undefined>;
    signUp(username: string, password: string): Promise<Login>;
    signOut(): void;
}
