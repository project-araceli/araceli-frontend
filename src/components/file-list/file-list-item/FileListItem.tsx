/**
 * Project: araceli-frontend
 * Created by: Nico Bulut
 * Created at: 28.05.24
 */

import React, {useEffect, useState} from 'react';
import {IonButton, IonContent, IonIcon, IonItem, IonLabel, IonPopover} from "@ionic/react";
import {
    documentOutline,
    downloadOutline,
    ellipsisHorizontalOutline,
    folderOutline,
    shareSocialOutline,
    trashOutline
} from "ionicons/icons";
import {IResource} from "../../../common/models";
import {ResourceType} from "../../../common/global-constants";
import apiClient from "../../../common/api-client";
import {saveAs} from "file-saver";
import {useCookies} from "react-cookie";
import {useHistory} from "react-router-dom";

interface IFileListItemProps {
    item: IResource;
    handleOnClickFileListItem: (item: IResource) => void;
    deleteFile: (item: IResource) => void;
    showPath?: boolean;
    onClickEditButton?: (item: IResource) => void;
    onClickShareButton?: (item: IResource) => void;
}

const FileListItem = ({item, handleOnClickFileListItem, deleteFile, showPath = false, onClickEditButton, onClickShareButton}: IFileListItemProps) => {
    const [path, setPath] = useState<string>();
    const [cookies, setCookies] = useCookies();
    const navigate = useHistory();

    useEffect(() => {

        if (cookies['auth-token']) {
            navigate.push("/login")
        }
    }, []);

    const getPath = () => {
        apiClient.get("/resource/" + item.resourceId + "/path", {headers: { Authorization: `Bearer ${cookies['auth-token']}`}})
            .then(res => res.data.length > 30 ? setPath("..." + res.data.substring(res.data.length-30)) : setPath(res.data))
            .catch(err => console.log(err.message));
    }
    if (showPath) {
        getPath();
    }

    const downloadFile = (e: React.MouseEvent<HTMLIonButtonElement>) => {
        e.stopPropagation();
        apiClient.get("/resource/download/" + item.resourceId, {responseType: "blob", headers: { Authorization: `Bearer ${cookies['auth-token']}`}})
            .then(res => {
                const file = new Blob([res.data], {type: item.contentType});
                saveAs(file, item.name);
            })
            .catch(err => console.log(err));
    }

    return (
        <IonItem onClick={() => handleOnClickFileListItem(item)}>
            <IonIcon icon={item.type === ResourceType.FOLDER ? folderOutline: documentOutline}/>
            <IonLabel className={"ps-5"}>{item.name.length > 30 ? item.name.substring(0, 30) + "..." : item.name}</IonLabel>
            {showPath ? <IonLabel>{path}</IonLabel> : <></>}
            {showPath ? <></> : <IonLabel>{item.createdAt}</IonLabel>}
            {item.type === ResourceType.FILE ? <IonButton onClick={downloadFile}><IonIcon icon={downloadOutline}/></IonButton> : <></>}
            <IonButton onClick={(e) => {e.stopPropagation(); deleteFile(item)}}><IonIcon icon={trashOutline}/></IonButton>
            <IonButton onClick={(e) => {e.stopPropagation(); onClickEditButton && onClickEditButton(item)}}><IonIcon icon={ellipsisHorizontalOutline}/></IonButton>
            <IonButton onClick={(e) => {e.stopPropagation(); onClickShareButton && onClickShareButton(item)}}><IonIcon icon={shareSocialOutline}/></IonButton>
        </IonItem>
    );
};

export default FileListItem;