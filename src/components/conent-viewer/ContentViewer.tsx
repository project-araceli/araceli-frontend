/**
 * Project: araceli-frontend
 * Created by: Michael Hütter
 * Created at: 11.06.2024
 */
import {useEffect, useState} from "react";
import apiClient from "../../common/api-client";
import {IonImg} from "@ionic/react";

interface Props {
    resourceId: string,
    contentType: string
}

const ContentViewer = ({resourceId, contentType}: Props) => {

    const [fileUrl, setFileUrl] = useState<string>();

    useEffect(() => {
        apiClient.get("/resource/download/" + resourceId, {responseType: "blob", headers: {Authorization: "TOKEN"}})
            .then(res => {
                const file = new Blob([res.data], {type: contentType});
                setFileUrl(URL.createObjectURL(file));
                // window.open(fileURL);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <>
            <IonImg src={fileUrl}/>
        </>
    );
};

export default ContentViewer;