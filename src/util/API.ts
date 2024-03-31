import {IUser} from "../interfaces/IUser";
import {ShareXConfigResponse, URLListResponse, UserUploadListResponse} from "../interfaces/IAPI"
import config from "../config.json";

export const getUserRecentlyUploaded = async (user: IUser | null, amount: number): Promise<UserUploadListResponse | null> => {
    if (!user) {
        return null;
    }

    const result = await fetch(config.apiEndpoint + "/users/@me/uploads/get/" + amount, {
        headers: {
            "Authorization": user.apiKey
        }
    });
    const res = await result.json() as UserUploadListResponse;

    if (res.d) {
        return res;
    }

    return null;
};

export const getAllDomains = async (): Promise<URLListResponse | null> => {
    const result = await fetch(config.apiEndpoint + "/domain/list/all");
    const res = await result.json() as URLListResponse;

    if(res.d){
        return res;
    }

    return null;
}

export const getShareXConfig = async (user: IUser | null): Promise<ShareXConfigResponse | null> => {
    if (!user) {
        console.log("No user")
        return null;
    }

    const result = await fetch(config.apiEndpoint + "/users/@me/generate/sharex", {
        headers: {
            "Authorization": user.apiKey
        }
    });
    const res = await result.json();

    if(res.d){
        return res;
    }

    return null;
}

