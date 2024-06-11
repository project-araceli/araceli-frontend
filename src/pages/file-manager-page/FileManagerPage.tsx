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
    IonHeader, IonIcon, IonInput, IonItem,
    IonMenuButton,
    IonModal,
    IonPage, IonRow,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import FileList from "../../components/file-list/FileList";
import {useDropzone} from "react-dropzone";
import apiClient from "../../common/api-client";
import {IResource} from "../../common/models";
import useResources from "../../hooks/useResources";
import {ResourceType} from "../../common/global-constants";
import {addOutline, documentOutline, folderOutline} from "ionicons/icons";

const FileManagerPage = () => {
    const [isAddFileOpen, setIsAddFileOpen] = useState<boolean>(false);
    const [isAddFolderOpen, setIsAddFolderOpen] = useState<boolean>(false);
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({maxFiles: 1});

    const {resources, setResources} = useResources();
    const [currentFolder, setCurrentFolder] = useState<IResource>({} as IResource);
    const [lastFolders, setLastFolders] = useState<IResource[] | undefined>();

    const rootFolder: IResource = {
        resourceId: "root",
        name: "/",
        type: ResourceType.FOLDER,
        children: resources
    }

    useEffect(() => {
        setCurrentFolder(rootFolder);
    }, [resources]);

    const onSubmitFileCreateForm = () => {
        const formData = new FormData();

        if (acceptedFiles.length !== 0) {
            formData.append("file", acceptedFiles[0]);
            formData.append("name", acceptedFiles[0].name);
            formData.append("parentId", currentFolder.resourceId);
            formData.append("contentType", acceptedFiles[0].type);
            apiClient.post("/resource", formData, {headers: {Authorization: "TOKEN"}})
                .then(res => {
                    setIsAddFileOpen(false);
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

    const deleteFile = (item: IResource) => {
        apiClient.delete("/resource/" + item.resourceId, {headers: {Authorization: "TOKEN"}})
            .then(res => {
                setCurrentFolder({
                    ...currentFolder,
                    children: currentFolder.children?.filter(x => x.resourceId !== item.resourceId)
                });
            })
            .catch(err => console.log(err.message));
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton/>
                    </IonButtons>
                    <IonTitle>Files</IonTitle>
                    <IonButton slot={"end"} onClick={() => setIsAddFolderOpen(true)}><IonIcon
                        icon={folderOutline}/><IonIcon icon={addOutline}/></IonButton>
                    <IonButton slot={"end"} style={{margin: 10}} onClick={() => setIsAddFileOpen(true)}><IonIcon
                        icon={documentOutline}/><IonIcon icon={addOutline}/></IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonGrid className={"ms-5 mt-5"}>
                    <IonRow>
                        <IonCol size={"1"}><IonChip color="primary">{currentFolder.name}</IonChip></IonCol>
                        <IonCol size={"1"}><IonButton disabled={lastFolders === undefined}
                                                      onClick={goBackToLastFolder}>Back</IonButton></IonCol>
                    </IonRow>
                </IonGrid>
                <FileList resources={currentFolder.children} handleOnClickFileListItem={handleOnClickFileListItem}
                          deleteFile={deleteFile}/>
                <IonModal isOpen={isAddFileOpen} onWillDismiss={() => setIsAddFileOpen(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Add file</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setIsAddFileOpen(false)}>Close</IonButton>
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
                        <IonButton type={"button"} className={"w-full"} onClick={() => onSubmitFileCreateForm()}>Upload
                            File</IonButton>
                    </IonContent>
                </IonModal>
                <IonModal isOpen={isAddFolderOpen} onWillDismiss={() => setIsAddFolderOpen(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Create folder</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setIsAddFolderOpen(false)}>Close</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <IonInput
                            label="Name"
                            labelPlacement="stacked"
                            type="text"
                            placeholder="Folder name"
                        />
                        <IonButton type={"button"} className={"w-full"} onClick={() => onSubmitFileCreateForm()}>Create
                            Folder</IonButton>
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default FileManagerPage;