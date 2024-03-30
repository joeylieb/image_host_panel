import {IUser} from "../interfaces/IUser";
import {UserUploadListResponse} from "../interfaces/IAPI"
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
