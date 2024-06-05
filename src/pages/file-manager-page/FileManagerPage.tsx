/**
 * Project: araceli-frontend
 * Created by: Nico Bulut
 * Created at: 28.05.24
 */

import React, {useEffect, useState} from 'react';
import {
    IonButton,
    IonButtons,
    IonChip, IonCol,
    IonContent, IonGrid,
    IonHeader,
    IonMenuButton,
    IonModal,
    IonPage, IonRow,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import '../Page.css'
import {
    archiveOutline,
    archiveSharp,
    arrowRedo,
    arrowRedoOutline,
    folder,
    folderOutline,
    heartOutline,
    heartSharp,
    trashOutline,
    trashSharp
} from "ionicons/icons";
import FileList from "../../components/file-list/FileList";
import {useDropzone} from "react-dropzone";
import apiClient from "../../common/api-client";
import {IResource} from "../../common/models";
import useResources from "../../hooks/useResources";
import {ResourceType} from "../../common/global-constants";

interface AppPage {
    url: string;
    iosIcon: string;
    mdIcon: string;
    title: string;
}

const appPages: AppPage[] = [
    {
        title: 'My Files',
        url: '/folder/files',
        iosIcon: folderOutline,
        mdIcon: folder
    },
    {
        title: 'Shared With Me',
        url: '/folder/shared',
        iosIcon: arrowRedoOutline,
        mdIcon: arrowRedo
    },
    {
        title: 'Favorites',
        url: '/folder/Favorites',
        iosIcon: heartOutline,
        mdIcon: heartSharp
    },
    {
        title: 'Archived',
        url: '/folder/Archived',
        iosIcon: archiveOutline,
        mdIcon: archiveSharp
    },
    {
        title: 'Trash',
        url: '/folder/Trash',
        iosIcon: trashOutline,
        mdIcon: trashSharp
    }
];

const FileManagerPage = () => {

    const [isOpen, setIsOpen] = useState(false);
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({maxFiles: 1});

    const {resources, setResources} = useResources();
    const [currentFolder, setCurrentFolder] = useState<IResource>({} as IResource);
    const [lastFolders, setLastFolders] = useState<IResource[] | undefined>();

    const rootFolder: IResource = {
        resourceId: "root",
        name: "root",
        type: ResourceType.FOLDER,
        children: resources
    }

    useEffect(() => {
        setCurrentFolder(rootFolder);
    }, [resources]);

    const onSubmit = () => {
        const formData = new FormData();

        if (acceptedFiles.length !== 0) {
            formData.append("file", acceptedFiles[0]);
            formData.append("name", acceptedFiles[0].name);
            formData.append("parentId", currentFolder.resourceId);
            formData.append("contentType", acceptedFiles[0].type);
            apiClient.post("/resource", formData, {headers: {Authorization: "TOKEN"}})
                .then(res => {
                    setIsOpen(false);
                    if (currentFolder.children) {
                        setCurrentFolder({...currentFolder, children: [...currentFolder.children, res.data]});
                    }
                })
                .catch(err => console.log(err.message));
        }
    }

    const handleOnClickFileListItem = (item: IResource) => {
        if (item.type === ResourceType.FOLDER) {
            if (lastFolders !== undefined) {
                setLastFolders([...lastFolders, currentFolder]);
            } else {
                setLastFolders([currentFolder]);
            }
            setCurrentFolder(item);
        }
    }

    const goBackToLastFolder = () => {
        if (lastFolders !== undefined && lastFolders.length !== 0) {
            const newCurrentFolder = lastFolders.pop();
            if (newCurrentFolder) {
                setCurrentFolder(newCurrentFolder);
                const newLastFolders = lastFolders.filter(x => x.resourceId !== newCurrentFolder.resourceId);
                if (newLastFolders.length === 0) {
                    setLastFolders(undefined);
                } else {
                    setLastFolders(newLastFolders);
                }

                return;
            }
        }
        setCurrentFolder(rootFolder);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton/>
                    </IonButtons>
                    <IonTitle>Files</IonTitle>
                    <IonButton slot={"end"} style={{margin: 10}} onClick={() => setIsOpen(true)}>Create</IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonGrid className={"ms-5 mt-5"}>
                    <IonRow>
                        <IonCol size={"1"}><IonChip color="primary">{currentFolder.name}</IonChip></IonCol>
                        <IonCol size={"1"}><IonButton disabled={lastFolders === undefined} onClick={goBackToLastFolder}>Back</IonButton></IonCol>
                    </IonRow>
                </IonGrid>
                <FileList resources={currentFolder.children} handleOnClickFileListItem={handleOnClickFileListItem}/>
                <IonModal isOpen={isOpen} onWillDismiss={() => setIsOpen(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Add file</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <div>
                            <div {...getRootProps({className: 'dropzone'})}
                                 className={"flex flex-row w-full bg-blue-50 h-56 justify-center rounded"}>
                                <input {...getInputProps()} />
                                <p className={"align-middle text-black"}>Drag 'n' drop one file here, or click to select
                                    one file</p>
                            </div>
                            <aside className={"mt-10"}>
                                <h4>File selected for upload:</h4>
                                <ul><b>{acceptedFiles.map(x => x.name)}</b></ul>
                            </aside>
                        </div>
                        <IonButton type={"button"} className={"w-full"} onClick={() => onSubmit()}>Upload
                            File</IonButton>
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default FileManagerPage;