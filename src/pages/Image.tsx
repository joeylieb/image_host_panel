import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import config from "../config.json";
import {Helmet} from "react-helmet";
import {imageDataResponse} from "../interfaces/IAPI";
import {getImageData} from "../util/API";
import Moment from "react-moment";

export const Image = () => {
    const { imageID } = useParams<string>();
    const [imageLink, setImageLink] = useState<string>("");
    const [imageData, setImageData] = useState<imageDataResponse>();

    useEffect(() => {
        if(!imageID) return;
        validImage(imageID).then(() => {
            setImageLink(config.apiEndpoint + "/" + imageID);
        });
        getImageData(imageID).then((data) => {
            if(data) setImageData(data);

        })
    }, []);

    const validImage = async (id: string): Promise<boolean> => {
        const response = await fetch(config.apiEndpoint + "/" + id);
        return response.ok;
    }

    return(
        <div>
            <Helmet>
                <title>{imageID}</title>
                <meta property="og:title" content={imageData?.d.embedData.title}/>
                <meta property="og:description" content={imageData?.d.embedData.description}/>
                <meta property="og:image" content={imageLink} />
                <meta name="twitter:card" content="summary_large_image"/>
            </Helmet>
            <div id="image-data">
                <h3>Created by {imageData?.d.user}</h3>
                <img src={imageLink} alt={imageID}/>
                <Moment unix format="MMMM Do 'YY">{imageData?.d.timeCreated}</Moment>
            </div>
        </div>
    )
}