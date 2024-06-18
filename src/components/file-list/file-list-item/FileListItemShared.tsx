/**
* Project: araceli-frontend
* Created by: Michael Hütter
* Created at: 18.06.2024
*/
import {IResource} from "../../../common/models";
import React from "react";
import apiClient from "../../../common/api-client";
import {saveAs} from "file-saver";
import {IonButton, IonIcon, IonItem, IonLabel} from "@ionic/react";
import {ResourceType} from "../../../common/global-constants";
import {
    documentOutline,
    downloadOutline,
    ellipsisHorizontalOutline,
    folderOutline,
    shareSocialOutline,
    trashOutline
} from "ionicons/icons";
import {useCookies} from "react-cookie";


interface IFileListItemSharedProps {
    item: IResource;
    handleOnClickFileListItem: (item: IResource) => void;
}
    
const FileListItemShared = ({item, handleOnClickFileListItem}: IFileListItemSharedProps) => {
    const [cookies, setCookie] = useCookies();

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
            {item.type === ResourceType.FILE ? <IonButton onClick={downloadFile}><IonIcon icon={downloadOutline}/></IonButton> : <></>}
        </IonItem>
    );
};
    
export default FileListItemShared;