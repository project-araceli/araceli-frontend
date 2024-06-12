/**
 * Project: araceli-frontend
 * Created by: Nico Bulut
 * Created at: 28.05.24
 */

import React, {useEffect, useState} from 'react';
import {
    IonButton,
    IonButtons,
    IonChip,
    IonContent,
    IonHeader, IonIcon, IonInput,
    IonMenuButton,
    IonModal,
    IonPage,
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
import {root} from "postcss";

const FileManagerPage = () => {
        const [isAddFileOpen, setIsAddFileOpen] = useState<boolean>(false);
        const [isAddFolderOpen, setIsAddFolderOpen] = useState<boolean>(false);
        const {acceptedFiles, getRootProps, getInputProps} = useDropzone({maxFiles: 1});
        const [folderName, setFolderName] = useState<string | undefined>();

        const {resources, setResources, refreshing, setRefreshing} = useResources();
        const rootFolder: IResource = {
            resourceId: "root",
            name: "/",
            type: ResourceType.FOLDER,
            children: resources
        }

        const [currentFolder, setCurrentFolder] = useState<IResource>({} as IResource);
        const [lastFolders, setLastFolders] = useState<IResource[] | undefined>();

        useEffect(() => {
            console.log(lastFolders);
            const previousCurrentFolder = {...currentFolder};
            setCurrentFolder(rootFolder);
            // console.log(previousCurrentFolder);
            if (previousCurrentFolder.resourceId !== rootFolder.resourceId && Object.keys(previousCurrentFolder).length !== 0) {
                setCurrentFolder(previousCurrentFolder);
                syncLastFoldersWithResources();
                console.log("IN HERE")
            }
        }, [resources, refreshing]);

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
                            setRefreshing(!refreshing);
                        }
                    })
                    .catch(err => console.log(err.message));
            }
        }

        const createFolder = () => {
            if (folderName) {
                const formData = new FormData();
                formData.append("name", folderName);
                formData.append("parentId", currentFolder.resourceId);
                formData.append("contentType", "FOLDER");
                apiClient.post("/resource", formData, {headers: {Authorization: "TOKEN"}})
                    .then(res => {
                        setIsAddFolderOpen(false);
                        if (currentFolder.children) {
                            setCurrentFolder({...currentFolder, children: [...currentFolder.children, res.data]});
                            setRefreshing(!refreshing);
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
                    setRefreshing(!refreshing);
                })
                .catch(err => console.log(err.message));
        }

        const syncLastFoldersWithResources = () => {
            if (lastFolders !== undefined && lastFolders.length !== 0) {
                console.log("SYNC STARTS");
                let temp: IResource = {...rootFolder, children: resources};
                const newLastFoldersArray: IResource[] = [rootFolder];
                for (let folder of lastFolders) {
                    console.log(folder);
                    const updatedFolder = temp.children?.find(x => x.resourceId === folder.resourceId);
                    if (updatedFolder) {
                        newLastFoldersArray.push(updatedFolder);
                        temp = updatedFolder;
                    }
                }
                console.log("NEW ARRAY");
                console.log(newLastFoldersArray);
                setLastFolders(newLastFoldersArray);
            }
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
                    <div className={"mx-5 mt-5"}>
                        <div className={"flex flex-row justify-between"}>
                            <div><IonChip
                                color="primary">{lastFolders ? lastFolders.map(x => x.name).join("/").substring(1) + "/" + currentFolder.name : currentFolder.name}</IonChip>
                            </div>
                            <div><IonButton disabled={lastFolders === undefined}
                                            onClick={goBackToLastFolder}>Back</IonButton></div>
                        </div>
                    </div>
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
                                onIonChange={(e) => setFolderName("" + e.target.value)}
                            />
                            <IonButton type={"button"} className={"w-full"} onClick={() => createFolder()}>Create
                                Folder</IonButton>
                        </IonContent>
                    </IonModal>
                </IonContent>
            </IonPage>
        );
    }
;

export default FileManagerPage;