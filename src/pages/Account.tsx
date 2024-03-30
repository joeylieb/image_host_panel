import {useAuth} from "../components/AuthProvider";
import React, {FormEvent, MouseEventHandler, useEffect, useState} from "react";
import {IUser} from "../interfaces/IUser";
import {Loading} from "../components/Loading";
import Select from 'react-select';
import {URLListResponse, UserUploadListResponse} from "../interfaces/IAPI";
import axios from "axios";
import Moment from "react-moment";
import "moment-timezone";
import "../css/account.css";
import {toast, ToastContainer} from "react-toastify";
import {Zoom} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import config from "../config.json";
import {getUserRecentlyUploaded} from "../util/API";
import {SelectedImage} from "../components/SelectedImage"


export const Account = () => {
    const auth = useAuth();
    const [user, setUser] = useState<IUser | null>(null);
    const [allURLs, setURLS] = useState<Array<{label: string, value: string}>>();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [selectedURL, setSelectedURL] = useState<{value: string; label: string;} | null>(null);
    const [recentlyUpload, setRecent] = useState<UserUploadListResponse | null>();
    const [reload, setReload] = useState<boolean>(false);

    const [selectedImage, setSelectedImage] = useState<{fileName: string; dateCreated: number; active: boolean}>();


    useEffect(() => {
        (async () => {
            try {
                const userData = await auth.fetchUser();
                const result = await fetch(config.apiEndpoint + "/domain/list/all");
                const res = await result.json() as URLListResponse;

                const imageData = await getUserRecentlyUploaded(userData, 10);

                setRecent(imageData)
                setURLS(res.d.map(e => ({label: e.url, value: e.id})))
                setUser(userData);
                setLoading(false);
                setReload(false);
                console.log(allURLs);
            } catch (e) {
                console.error("Error fetching user data:", e)
            }
        })();
    }, [reload]);



    const onURLSubmit = async () => {
        const output = document.getElementById("account-page-output")!;
        console.log(!selectedURL)
        if (!selectedURL) return output.innerText = "You need to select a domain!";

        const result = await fetch(config.apiEndpoint + "/users/@me/domain/edit", {
            method: "POST",
            headers: {
                "Authorization": auth.key,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({domain: selectedURL.label})
        });
        const res = await result.json();

        if(res.d) return setReload(true);

        return output.innerText = "An error has occurred!";
    }

    const onFileSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fileInput = e.currentTarget.children.item(0) as HTMLInputElement;
        const output = document.getElementById("account-page-output")!;
        const progressContainer = document.getElementById("progress-file-container")!;
        const progressBar = progressContainer.children.item(1) as HTMLProgressElement;

        progressContainer.style.display = "block";

        if (!fileInput.files) return output.innerText = "You need to select a file."

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);
        const res = await axios({
            method: "POST",
            url: config.apiEndpoint + "/upload/image",
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": auth.key
            },
            onUploadProgress: (progressEvent) => {
                progressBar!.value = (progressEvent.loaded / progressEvent.total! * 100 | 0)
            }
        });

        try {
            await navigator.clipboard.writeText(res.data.d.url)
            toast.success("Image link copied to clipboard!")
        } catch (e) {
            console.error(e);
            toast.error("An error when copying to your clipboard!")
        }

        progressContainer.style.display = "none";
        fileInput.value = "";

        setReload(true);
    }

    const onImageClick = (imageData: { fileName: string; dateCreated: number; e: React.MouseEvent<HTMLImageElement> }) => {
        if(selectedImage?.active) return;

        setSelectedImage({fileName: imageData.fileName, dateCreated: imageData.dateCreated, active: true});
    }

    const onSelectedImageClose = () => {

        setSelectedImage({fileName: "", dateCreated: 0, active: false})
    }

    const onSelectedImageCopy = () => {

        navigator.clipboard.writeText(config.apiEndpoint + "/" + selectedImage!.fileName).then(() => {
            toast.success("Image link copied to clipboard!")
        }).catch((e) => {
            toast.error("There was an error copying to clipboard!")
            console.error(e);
        })


    }



    if(user && !isLoading){
        return(
            <div id="account-page">
                <h1>Welcome {user.username}</h1>
                <p>You have {user.uploads} uploads</p>
                <div id="file-upload">
                    <p>Upload custom file to host</p>
                    <form onSubmit={onFileSubmit}>
                        <input type="file" id="fileUpload" name="filename"/>
                        <input type="submit"/>
                    </form>
                    <div id="progress-file-container">
                        <label htmlFor="file-progress">Progress: </label>
                        <progress id="file-progress" max="100"></progress>
                    </div>
                </div>
                <div style={{width: "300px"}} id="domain-changer">
                    <p>{user.selectedDomain ? `Currently selected domain: ${user.selectedDomain}` : ``}</p>
                    <Select options={allURLs} onChange={setSelectedURL} />
                    <button onClick={onURLSubmit}>Change URL</button>
                </div>
                <p id="account-page-output"></p>
                <div id="recent-uploads-user">
                    {recentlyUpload && recentlyUpload.d.map(data => (
                        <div key={data.id} className="image-account-page">
                            <img
                                src={config.apiEndpoint + "/" + data.fileName} alt={data.userUploaded}
                                onClick={(e) => onImageClick(({fileName: data.fileName, dateCreated: parseInt(data.dateCreated), e}))}
                            />
                        </div>
                    ))}
                </div>

                {selectedImage && (
                    <SelectedImage
                        active={selectedImage.active}
                        fileName={selectedImage.fileName}
                        dateCreated={selectedImage.dateCreated}
                        onClose={onSelectedImageClose}
                        onCopy={onSelectedImageCopy}
                    />
                )}

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

    return (
        <Loading/>
    )

}
