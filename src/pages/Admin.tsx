import {useAuth} from "../components/AuthProvider";
import {FormEvent, useEffect, useState} from "react";
import {ResultResponse} from "../interfaces/IAPI";

import config from "../config.json";

export const Admin = () => {
    const auth = useAuth();
    const [admin, setAdmin] = useState<boolean>(false);

    useEffect(() => {
        auth.isUserAdmin().then((res) => {
            if(res){
                setAdmin(true)
            }
        })
    }, [auth]);

    const onDomainSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const domainName = e.currentTarget.children.item(1) as HTMLInputElement;
        const domainCreated = e.currentTarget.children.item(4) as HTMLInputElement;

        const data = {
            name: domainName.value,
            createdBy: domainCreated.value
        }

        console.log(JSON.stringify(data))

        const response = await fetch(config.apiEndpoint + "/domain/create/new", {
            method: "POST",
            headers: {
                "Authorization": auth.key,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const res = await response.json() as ResultResponse;

        if(res.d.success){
            document.getElementById("admin-panel-output")!.innerText = "Successfully added new domain!"
        } else {
            document.getElementById("admin-panel-output")!.innerText = "Failed to add a new domain"
        }
    }

    if(admin){
        return(
            <div id="admin-panel">
                <div id="domain-form">
                    <form onSubmit={onDomainSubmit}>
                        <label htmlFor="domain-name">Domain: </label>
                        <input id="domain-name"/>
                        <br/>
                        <label htmlFor="domain-created">Created by (username): </label>
                        <input id="domain-created"/>
                        <br/>
                        <button>Add Domain</button>
                    </form>
                </div>
                <p id="admin-panel-output"></p>
            </div>
        )
    }

    return (
        <div>
            <p>You are not admin bro</p>
        </div>
    )
}
