import config from "../config.json";
import Moment from "react-moment";

export const SelectedImage = (props: {fileName: string; dateCreated: number; active: boolean, onClose: () => void, onCopy: () => void}) => {
    if(!props.active) {
        return (<div></div>);
    }

    return (
        <div id="selected-image-user">
            <button className="close-button" onClick={props.onClose}>X</button>
            <img src={config.apiEndpoint + "/" + props.fileName} alt="selected"/>
            <div id="image-data-actions">
                <span className="created-on">Created on </span>
                <Moment unix format="MMMM Do YYYY | h:mm A">{props.dateCreated}</Moment>
                <button onClick={props.onCopy}>Copy to clipboard</button>
            </div>

        </div>
    )
}
