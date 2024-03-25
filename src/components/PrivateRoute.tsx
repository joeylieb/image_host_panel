import {useAuth} from "./AuthProvider";
import {Navigate, Outlet} from "react-router-dom";

const PrivateRoute = () => {
    const user = useAuth();
    if(!user.key) return <Navigate to={"/login"}/>
    return <Outlet/>
}

export default PrivateRoute;
