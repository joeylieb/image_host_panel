import config from "../config.json";
import Moment from "react-moment";
import Modal from 'react-modal';

export const SelectedImage = (props: {fileName: string; dateCreated: number; active: boolean, onClose: () => void, onCopy: () => void}) => {

    Modal.setAppElement(document.getElementById('root')!);
    if(!props.active) {
        return (<div></div>);
    }

    return (
        <Modal isOpen={props.active} onRequestClose={props.onClose} contentLabel="Your Selected Image" className="image-modal">
            <div id="selected-image-user">
                <button className="close-button" onClick={props.onClose}>X</button>
                <img src={config.apiEndpoint + "/" + props.fileName} alt="selected"/>
                <div id="image-data-actions">
                    <span className="created-on">Created on </span>
                    <Moment unix format="MMMM Do YYYY | h:mm A">{props.dateCreated}</Moment>
                    <button onClick={props.onCopy}>Copy to clipboard</button>
                </div>

            </div>
        </Modal>

    )
}
