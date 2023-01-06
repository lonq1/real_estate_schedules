interface IUserRequest {
    name: string;
    email: string;
    password: string;
    isAdm: boolean;
}

interface IUserResponse {
    id: string;
    name: string;
    email: string;
    isAdm: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface IUserWithPasswordResponse {
    id: string;
    name: string;
    email: string;
    isAdm: boolean;
    createdAt: Date;
    updatedAt: Date;
    password: string;
}

interface IUserLogin {
    email: string;
    password: string;
}

interface IUserUpdate {
    name?: string;
    email?: string;
    password?: string;
}

interface IUserUpdateResponse {
    id: string;
    name: string;
    email: string;
    isAdm: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface IUserLoginResponse {
    statusCode: number;
    token?: string;
    message?: string;
}

export {
    IUserResponse,
    IUserLogin,
    IUserLoginResponse,
    IUserRequest,
    IUserUpdate,
    IUserUpdateResponse,
    IUserWithPasswordResponse,
};
