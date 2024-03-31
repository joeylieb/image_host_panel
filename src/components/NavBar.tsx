import "../css/navbar.css";
import {useEffect, useState} from "react";
import {redirect, useLocation} from "react-router-dom";

const NavBar = (props: {links: Array<{name: string, path: string}>}) => {
    const [navItems, setNavItems] = useState<Array<{name: string, path: string}>>(
        props.links
    );
    const location = useLocation();

    useEffect(() => {
        if(navItems.filter(e => e.path === location.pathname).length > 0){
            const result = navItems.filter(e => e.path !== location.pathname);
            setNavItems(result);
        }
    }, [location, navItems]);

    const onLinkClick = (href: string) => {
        console.log(href)
        window.location.replace(href)
    }



    return(
        <div id="navbar-main">
            <div id="navbar-link-container">
                {navItems.map((item, index) => (
                    <div key={index} className="navbar-item" onClick={() => onLinkClick(item.path)}>
                        <a className="navbar-link" href={item.path}>{item.name}</a>
                        <hr className="horizontal-nav-line"/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NavBar;
