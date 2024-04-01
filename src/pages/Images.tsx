import React, {useEffect, useState} from "react";
import {useAuth} from "../components/AuthProvider";
import {IUser} from "../interfaces/IUser";
import {UserUploadListResponse} from "../interfaces/IAPI";
import {deleteImage, getUserRecentlyUploaded} from "../util/API";
import config from "../config.json";
import {toast, ToastContainer, Zoom} from "react-toastify";
import {Loading} from "../components/Loading";
import Moment from "react-moment";
import 'react-toastify/dist/ReactToastify.css';

import "../css/images.css";

export const Images = () => {
    const auth = useAuth();
    const [user, setUser] = useState<IUser | null>(null);
    const [initialImages, setInitial] = useState<UserUploadListResponse | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            try {
                const userData = await auth.fetchUser();
                const images = await getUserRecentlyUploaded(userData, 10);

                setInitial(images);
                setUser(userData);
                setLoading(false);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [isLoading]);

    const onTableScroll = async (e: React.UIEvent<HTMLDivElement>) => {
        if (!initialImages) return;

        if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight) {
            console.log("hit bottom")
            const lastRowMoment = e.currentTarget.children.item(0)!.children.item(1)!.lastChild!.childNodes.item(0)!.lastChild as HTMLImageElement;
            await tableGenerate(initialImages.d.filter(e => e.id === lastRowMoment.alt)[0].dateCreated);
        }
    }

    const tableGenerate = async (lastUnix: string) => {
        if (!lastUnix) {
            console.log("returning, no last unix")
            return;
        }
        if(!initialImages) {
            console.log("returning, no inital images");
            return;
        }

        const images = await getUserRecentlyUploaded(user, 1, lastUnix) as UserUploadListResponse;

        if(!images) return null;

        for(const image of images.d){
            setInitial({status: 200, d: [...initialImages.d, image]});
        }
    }

    const onDeleteClick = async (fileName: string) => {
        const result = await deleteImage(user, fileName);
        if(result?.d.success){
            setLoading(true);
            return toast.success("Deleted image " + fileName);
        }

        return toast.error("An error occurred");
    }

    if(isLoading){
        return (
            <Loading/>
        )
    }

    return (
        <div id="images-page">
            <h1>Your images</h1>
            <div id="image-table" onScroll={onTableScroll}>
                <table>
                    <thead>
                        <tr id="image-table-header">
                            <th>Image</th>
                            <th>Date Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {initialImages && initialImages.d.map(data => (
                        <tr key={data.id}>
                            <td className="image-row">
                                <img src={config.apiEndpoint + "/" + data.fileName} loading="lazy" alt={data.id}/>
                            </td>
                            <td className="image-row">
                                <Moment unix format="MMMM Do 'YY">{data.dateCreated}</Moment>
                            </td>
                            <td className="image-row">
                                <button onClick={() => {onDeleteClick(data.fileName)}}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={8000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Zoom}
            />
        </div>
    )
}
