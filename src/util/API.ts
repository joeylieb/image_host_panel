import {IUser} from "../interfaces/IUser";
import {
    imageDataResponse,
    ResultResponse,
    ShareXConfigResponse,
    URLListResponse,
    UserUploadListResponse
} from "../interfaces/IAPI"
import config from "../config.json";

export const getUserRecentlyUploaded = async (user: IUser | null, amount: number, from?: string): Promise<UserUploadListResponse | null> => {
    if (!user) {
        return null;
    }

    const result = await fetch(config.apiEndpoint + "/users/@me/uploads/get/" + amount + `${from ? "?from=" + from : ""}`, {
        headers: {
            "Authorization": user.apiKey
        }
    });
    const res = await result.json() as UserUploadListResponse;


    if (res.d) {
        console.log("valid image data")
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
    if (!user) return null;

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

export const deleteImage = async (user: IUser | null, fileName: string): Promise<ResultResponse | null> => {
    if (!user) return null;
    const result = await fetch(config.apiEndpoint + "/" + fileName + "/delete", {
        headers: {
            "Authorization": user.apiKey
        },
        method: "DELETE"
    });
    const res = await result.json();

    if(res.d){
        return res;
    }

    return null;
}

export const getImageData = async(imageID: string): Promise<imageDataResponse | null> => {
    const result = await fetch(config.apiEndpoint + "/upload/image/data?fileName=" + imageID);
    const res = await result.json() as imageDataResponse;

    if(res.d){
        return res;
    }

    return null;
}

