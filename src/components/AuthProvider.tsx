import {createContext, useContext, useState} from "react";
import {IUser} from "../interfaces/IUser";
import {useNavigate} from "react-router-dom";
import {isAdminResponse, UserLoginResponse} from "../interfaces/IAPI";
import config from "../config.json";

interface AuthContextProps {
    key: string,
    user: IUser | null,
    loginAction: (data: any) => Promise<any>,
    logOut: () => void,
    fetchUser: () => Promise<IUser | null>,
    isUserAdmin: () => Promise<boolean>
}

const AuthContext = createContext({} as AuthContextProps);

const AuthProvider = ({children}: any) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [key, setKey] = useState<string>(localStorage.getItem("site") as string);
    const navigate = useNavigate();
    const loginAction = async (data: any) => {
        try {
            const response = await fetch(config.apiEndpoint + "/auth/login", {
               method: "POST",
               headers: {
                   "Content-Type": "application/json"
               },
               body: JSON.stringify(data)
            });
            const res = await response.json() as UserLoginResponse;
            if(res.d) {
                setUser(res.d);
                setKey(res.d.apiKey);
                localStorage.setItem("site", res.d.apiKey)
                navigate("/account");
            }

            return res;
        }catch (e) {
            console.error(e)
        }
    }

    const fetchUser = async (): Promise<IUser | null> => {
        try {
            const response = await fetch(config.apiEndpoint + "/users/@me", {
                method: "GET",
                headers: {
                    "Authorization": key,
                    "Content-Type": "application/json"
                }
            });
            const res = await response.json() as UserLoginResponse;

            if(res.d){
                return res.d as IUser;
            } else {
                console.log("no data")
                navigate("/login")
                return null;
            }
        }catch (e) {
            console.error(e)
        }

        return null;
    }

    const logOut = () => {
        setUser(null);
        setKey("");
        localStorage.removeItem("site");
        navigate("/login")
    }

    const isUserAdmin = async (): Promise<boolean> => {
        try {
            const response = await fetch(config.apiEndpoint + "/users/isAdmin", {
                method: "GET",
                headers: {
                    "Authorization": key,
                    "Content-Type": "application/json"
                }
            });
            const res = await response.json() as isAdminResponse;

            return res.d;
        } catch (e) {
            console.error(e)
        }

        return false;
    }

    return <AuthContext.Provider value={{key, user, loginAction, logOut, fetchUser, isUserAdmin}}>{children}</AuthContext.Provider>;
}

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
}
