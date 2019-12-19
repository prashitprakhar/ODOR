export interface IAuththenticationResponse {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
    kind?: string;
    displayName?: string;
}
