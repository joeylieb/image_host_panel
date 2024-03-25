import {IUser} from "./IUser";

export interface UserLoginResponse {
    status: number,
    d?: IUser
    error?: string
}

export interface isAdminResponse {
    status: number,
    d: boolean
}

export interface ResultResponse {
    status: number,
    d: {
        success: boolean
    }
}

export interface URLListResponse {
    status: number,
    d: Array<{url: string,
        dateAdded: string,
        id: string}>
}
