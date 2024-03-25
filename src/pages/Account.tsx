import {useAuth} from "../components/AuthProvider";
import {FormEvent, useEffect, useState} from "react";
import {IUser} from "../interfaces/IUser";
import {Loading} from "../components/Loading";
import Select from 'react-select';
import {URLListResponse} from "../interfaces/IAPI";
import axios from "axios";

import "../css/account.css";
import {toast, ToastContainer} from "react-toastify";
import {Zoom} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export const Account = () => {
    const auth = useAuth();
    const [user, setUser] = useState<IUser | null>(null);
    const [allURLs, setURLS] = useState<Array<{label: string, value: string}>>();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [selectedURL, setSelectedURL] = useState<{value: string; label: string;} | null>(null);


    useEffect(() => {
        (async () => {
            try {
                const userData = await auth.fetchUser();
                const result = await fetch("http://localhost:5005/domain/list/all");
                const res = await result.json() as URLListResponse;
                setURLS(res.d.map(e => ({label: e.url, value: e.id})))
                setUser(userData);
                setLoading(false)
                console.log(allURLs);
            } catch (e) {
                console.error("Error fetching user data:", e)
            }
        })();
    }, []);

    const onURLSubmit = async () => {
        const output = document.getElementById("account-page-output")!;
        console.log(!selectedURL)
        if (!selectedURL) return output.innerText = "You need to select a domain!";

        const result = await fetch("http://localhost:5005/users/@me/domain/edit", {
            method: "POST",
            headers: {
                "Authorization": auth.key,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({domain: selectedURL.label})
        });
        const res = await result.json();

        if(res.d) return window.location.reload();

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
            url: "http://localhost:5005/upload/image",
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
            toast.error("An error when copying to your clipboard!")
        }

        progressContainer.style.display = "none";
        fileInput.value = "";
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
