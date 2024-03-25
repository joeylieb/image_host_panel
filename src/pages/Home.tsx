export const Home = () => {
    const buttonClick = () => {
        window.location.replace("/login")
    }

    return(
        <div id="home-page">
            <p>Welcome to image host</p>
            <p>you gotta sign in with api key lmao</p>
            <button onClick={buttonClick}>here</button>
        </div>
    )
}
