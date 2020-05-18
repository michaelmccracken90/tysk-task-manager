export default interface Login {
    token?: string;
    user: {
        id: number;
        username: string;
    }
}
