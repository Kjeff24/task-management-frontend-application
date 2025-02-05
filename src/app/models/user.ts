export interface UserRequest {
 email: string;
 fullName: string;
 role: string;
}

export interface UserResponse {
    userId: string,
    email: string,
    fullName: string
}