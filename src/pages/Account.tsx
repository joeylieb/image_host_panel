import {useAuth} from "../components/AuthProvider";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {IUser} from "../interfaces/IUser";
import {Loading} from "../components/Loading";
import Select from 'react-select';
import {UserUploadListResponse} from "../interfaces/IAPI";
import axios from "axios";
import "moment-timezone";
import "../css/account.css";
import {toast, ToastContainer} from "react-toastify";
import {Zoom} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import config from "../config.json";
import {getAllDomains, getShareXConfig, getUserRecentlyUploaded} from "../util/API";
import {SelectedImage} from "../components/SelectedImage"
import NavBar from "../components/NavBar";
import {downloadFile} from "../util/File";

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
                const domains = await getAllDomains();
                const imageData = await getUserRecentlyUploaded(userData, 10);

                domains ? setURLS(domains.d.map(e => ({label: e.url, value: e.id}))) : toast.info("Could not receive domains");

                setRecent(imageData)
                setUser(userData);
                setReload(false);
                setLoading(false)
            } catch (e) {
                console.error("Error fetching user data:", e)
            }
        })();
    }, [reload]);



    const onURLSubmit = async () => {
        if (!selectedURL) return toast.error("You need to select a URL!")

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

        return toast.error("An error has occurred!");
    }

    const onFileSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fileInput = e.currentTarget.children.item(0) as HTMLInputElement;
        const progressContainer = document.getElementById("progress-file-container")!;
        const progressBar = progressContainer.children.item(1) as HTMLProgressElement;
        const imageDisplay = document.getElementById("display-selected-image") as HTMLImageElement;

        if (!fileInput.files) return toast.info("You need to select a file");

        progressContainer.style.display = "block";

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

        imageDisplay.src = "";
        document.getElementById("display-selected-image")!.style.display = "none";

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

        navigator.clipboard.writeText("https://" + user?.selectedDomain + "/" + selectedImage!.fileName).then(() => {
            toast.success("Image link copied to clipboard!")
        }).catch((e) => {
            toast.error("There was an error copying to clipboard!")
            console.error(e);
        })


    }

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(!e.currentTarget.files) return;

        const imageDisplay = document.getElementById("display-selected-image") as HTMLImageElement;
        imageDisplay.src = URL.createObjectURL(e.currentTarget.files[0]);
        imageDisplay.style.display = "block";
    }

    const onSignOut = () => {
        auth.logOut();
    }

    const onConfigGen = async () => {
        const config = await getShareXConfig(user);

        if(!config) return toast.error("Error generating config");

        const jsonString = JSON.stringify(config.d, null, 2);
        downloadFile(jsonString, `${user?.username}-config.sxcu`);
    }



    if(user && !isLoading){
        return(
            <div id="account-page">

                <NavBar links={[
                    {name: "Home", path: "/"},
                    {name: "Images", path: "/account/images"},
                    {name: "Settings", path: "/account/settings"},
                    {name: "Sign Out", path: "/account/signout"},
                ]}/>

                <h1>Welcome {user.username}</h1>
                <p>You have {user.uploads} uploads</p>
                <p>{user.selectedDomain ? `Currently selected domain: ${user.selectedDomain}` : ``}</p>
                <button onClick={onConfigGen}>Generate ShareX Config</button>

                <div id="account-page-utils">
                    <div id="file-upload" className="account-util">
                        <p>Upload custom file to host</p>
                        <form onSubmit={onFileSubmit}>
                            <input type="file" id="fileUpload" name="filename" onChange={onFileChange}/>
                            <input type="submit"/>
                        </form>
                        <div id="progress-file-container">
                            <label htmlFor="file-progress">Progress: </label>
                            <progress id="file-progress" max="100"></progress>
                        </div>
                        <img id="display-selected-image"  alt="Your chosen file"/>
                    </div>
                    <div style={{width: "300px"}} id="domain-changer" className="account-util">
                        <p>Change URL:</p>
                        <Select options={allURLs} onChange={setSelectedURL} />
                        <button onClick={onURLSubmit}>Change URL</button>
                    </div>
                    <div className="account-util">
                        <p>Most recently uploaded pictures</p>
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

                    </div>
                </div>

                <button onClick={onSignOut} id="sign-out-account">Sign Out</button>

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
