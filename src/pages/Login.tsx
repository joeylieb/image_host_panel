import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {useAuth} from "../components/AuthProvider";
import {UserLoginResponse} from "../interfaces/IAPI";

export const Login = () => {
    const [key, setKey] = useState<string>();
    const auth = useAuth();

    useEffect(() => {
        if(auth.key.length > 1){
            auth.loginAction({key: auth.key}).then((result) => {
                if(result.d){
                    window.location.replace("/account");
                }
            }).catch((e) => {
                console.error("API IS OFF")
            })
        }
    }, [auth])

    const handleSubmitEvent = (e: FormEvent<HTMLFormElement>) => {
        const passwordOutput = e.currentTarget.children.item(0)!.children.item(2)!;
        e.preventDefault();
        if(key?.trim().length! < 1) return passwordOutput.innerHTML = "You need to input a password!"
        auth.loginAction({key}).then((res: UserLoginResponse) => {
           if(res.error) {
               return passwordOutput.innerHTML = "Account not found!"
           }
        });
    }

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        setKey(e.target.value)
    }

    const skillIssue = () => {
        alert("Skill Issue")
    }

    return (
        <div id="login-page">
            <form onSubmit={handleSubmitEvent}>
                <div className="form-control">
                    <label htmlFor="apiKey-input">API Key: </label>
                    <input
                        type="password"
                        id="apiKey-input"
                        name="password"
                        aria-describedby="password"
                        aria-invalid="false"
                        onChange={handleInput}
                    />
                    <div id="password-output"></div>
                </div>
                <button>Submit</button>
            </form>
            <br/>
            <a onClick={skillIssue} href="/login">Don't have one?</a>
        </div>
    )
}
