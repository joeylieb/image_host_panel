import NavBar from "../components/NavBar";
import "../css/home.css";
import {useEffect} from "react";
import {getAllDomains} from "../util/API";

export const Home = () => {
    useEffect(() => {
        (async () => {
            try {
                const domains = await getAllDomains();
                if(domains){
                    const domainNumberDisplay = document.getElementById("amount-domains-home") as HTMLSpanElement;
                    let length = domains.d.length;
                    let current = 0;

                    let countInterval: NodeJS.Timeout | null = setInterval(function(){
                        current++;
                        domainNumberDisplay!.innerText = current.toString();
                        domainNumberDisplay!.style.color = `rgb(0, ${((current/ length) * 255)/2}, ${current/length * 255})`
                        if(current >= length){
                            if(countInterval) {
                                clearInterval(countInterval);
                                countInterval = null;
                            }
                        }
                    }, 100)
                }


            } catch (e) {
                console.error(e)
            }
        })();
    }, [])

    return(
        <div id="home-page">
            <NavBar links={[{path: "/login", name: "Login"}, {path: "/account", name: "Account"}]}/>
            <div id="home-display-header">
                <h1>Joey585's Image Host</h1>
                <p>Currently <span id="amount-domains-home"></span> domains listed</p>
            </div>

        </div>
    )
}
