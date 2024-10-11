import {IUser} from "./IUser";

export interface UserLoginResponse {
    status: number,
    d?: IUser
    error?: string
}

export interface imageDataResponse {
    status: number,
    d: {
        embedData: {
            title: string,
            description: string,
            color: string
        },
        user: string,
        timeCreated: string
    }
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

export interface UserUploadListResponse {
    status: number,
    d: Array<{
        fileExtension: string
        id: string
        dateCreated: string
        userUploaded: string
        fileName: string
        fileType: string
    }>
}

export interface ShareXConfigResponse {
    status: number,
    d: {
        Version: string;
        Name: string;
        DestinationType: string;
        RequestMethod: string;
        RequestURL: string;
        Headers: {
            Authorization: string;
        };
        Body: string;
        FileFormName: string;
        URL: string;
    }
}
