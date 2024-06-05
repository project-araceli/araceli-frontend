/**
 * Project: araceli-frontend
 * Created by: Nico Bulut
 * Created at: 28.05.24
 */

import React from 'react';
import {IonButton, IonIcon, IonItem, IonLabel} from "@ionic/react";
import {documentOutline, downloadOutline, ellipsisHorizontalOutline, folderOutline, trashOutline} from "ionicons/icons";
import {IResource} from "../../../common/models";
import {ResourceType} from "../../../common/global-constants";
import apiClient from "../../../common/api-client";
import {saveAs} from "file-saver";

interface IFileListItemProps {
    item: IResource;
    handleOnClickFileListItem: (item: IResource) => void;
}

const FileListItem = ({item, handleOnClickFileListItem}: IFileListItemProps) => {

    const downloadFile = (e: React.MouseEvent<HTMLIonButtonElement>) => {
        e.stopPropagation();
        apiClient.get("/resource/download/" + item.resourceId, {responseType: "blob", headers: {Authorization: "TOKEN"}})
            .then(res => {
                const file = new Blob([res.data], {type: item.contentType});
                saveAs(file, item.name);
                /*const fileURL = URL.createObjectURL(file);
                window.open(fileURL);*/
            })
            .catch(err => console.log(err));
    }

    return (
        <IonItem onClick={() => handleOnClickFileListItem(item)}>
            <IonIcon icon={item.type === ResourceType.FOLDER ? folderOutline: documentOutline}/>
            <IonLabel className={"ps-5"}>{item.name}</IonLabel>
            {item.type === ResourceType.FILE ? <IonButton onClick={downloadFile}><IonIcon icon={downloadOutline}/></IonButton> : <></>}
            <IonButton><IonIcon icon={trashOutline}/></IonButton>
            <IonButton><IonIcon icon={ellipsisHorizontalOutline}/></IonButton>
        </IonItem>
    );
};

export default FileListItem;