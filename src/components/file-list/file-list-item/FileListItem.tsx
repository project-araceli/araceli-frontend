/**
 * Project: araceli-frontend
 * Created by: Nico Bulut
 * Created at: 28.05.24
 */

import React, {useState} from 'react';
import {IonButton, IonIcon, IonItem, IonLabel} from "@ionic/react";
import {documentOutline, downloadOutline, ellipsisHorizontalOutline, folderOutline, trashOutline} from "ionicons/icons";
import {IResource} from "../../../common/models";
import {ResourceType} from "../../../common/global-constants";
import apiClient from "../../../common/api-client";
import {saveAs} from "file-saver";

interface IFileListItemProps {
    item: IResource;
    handleOnClickFileListItem: (item: IResource) => void;
    deleteFile: (item: IResource) => void;
    showPath?: boolean;
}

const FileListItem = ({item, handleOnClickFileListItem, deleteFile, showPath = false}: IFileListItemProps) => {
    const [path, setPath] = useState<string>();

    const getPath = () => {
        apiClient.get("/resource/" + item.resourceId + "/path", {headers: {Authorization: "TOKEN"}})
            .then(res => res.data.length > 30 ? setPath("..." + res.data.substring(res.data.length-30)) : setPath(res.data))
            .catch(err => console.log(err.message));
    }
    if (showPath) {
        getPath();
    }

    const downloadFile = (e: React.MouseEvent<HTMLIonButtonElement>) => {
        e.stopPropagation();
        apiClient.get("/resource/download/" + item.resourceId, {responseType: "blob", headers: {Authorization: "TOKEN"}})
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
            {path ? <IonLabel>{path}</IonLabel> : <></>}
            {showPath ? <></> : <IonLabel>{item.createdAt}</IonLabel>}
            {item.type === ResourceType.FILE ? <IonButton onClick={downloadFile}><IonIcon icon={downloadOutline}/></IonButton> : <></>}
            <IonButton onClick={(e) => {e.stopPropagation(); deleteFile(item)}}><IonIcon icon={trashOutline}/></IonButton>
            <IonButton><IonIcon icon={ellipsisHorizontalOutline}/></IonButton>
        </IonItem>
    );
};

export default FileListItem;