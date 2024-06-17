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
    IonPage, IonSearchbar, IonSelect, IonSelectOption,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import FileList from "../../components/file-list/FileList";
import {useDropzone} from "react-dropzone";
import apiClient from "../../common/api-client";
import {IResource} from "../../common/models";
import useResources from "../../hooks/useResources";
import {ResourceType} from "../../common/global-constants";
import {addOutline, documentOutline, folderOutline, move, search} from "ionicons/icons";
import Modal from "../../components/modal/Modal";

const FileManagerPage = () => {
    const [isAddFileOpen, setIsAddFileOpen] = useState<boolean>(false);
    const [isAddFolderOpen, setIsAddFolderOpen] = useState<boolean>(false);
    const [isEditFileOpen, setIsEditFileOpen] = useState<boolean>(false);
    const [showPath, setShowPath] = useState<boolean>(false);

    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({maxFiles: 1});
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [fileToBeEdited, setFileToBeEdited] = useState<IResource | undefined>();
    const [initialCurrentFolder, setInitialCurrentFolder] = useState<IResource>({} as IResource);

    const {
        resources,
        refreshing,
        setRefreshing,
        search,
        setSearch,
        fileExtension,
        setFileExtension
    } = useResources();
    const rootFolder: IResource = {
        resourceId: "root",
        name: "/",
        type: ResourceType.FOLDER,
        children: resources,
        createdAt: ""
    }

    const [currentFolder, setCurrentFolder] = useState<IResource>({} as IResource);
    const [lastFolders, setLastFolders] = useState<IResource[] | undefined>();
    const fileExtensionOptions = ["all", ".png", ".jpeg", ".docx", ".txt", ".md"];

    useEffect(() => {
        const previousCurrentFolder = {...currentFolder};
        setCurrentFolder(rootFolder);
        if (previousCurrentFolder.resourceId !== rootFolder.resourceId && Object.keys(previousCurrentFolder).length !== 0) {
            setCurrentFolder(previousCurrentFolder);
            syncLastFoldersWithResources();
        }
        if (search || fileExtension && fileExtension !== "all") {
            setShowPath(true);
        } else {
            setShowPath(false);
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
                        acceptedFiles.pop(); // reset files in drop zone
                    }
                })
                .catch(err => console.log(err.message));
        }
    }

    const createFolder = () => {
        if (name && name.trim() !== "") {
            const formData = new FormData();
            formData.append("name", name);
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
            let temp: IResource = {...rootFolder, children: resources};
            const newLastFoldersArray: IResource[] = [rootFolder];
            for (let folder of lastFolders) {
                const updatedFolder = temp.children?.find(x => x.resourceId === folder.resourceId);
                if (updatedFolder) {
                    newLastFoldersArray.push(updatedFolder);
                    temp = updatedFolder;
                }
            }
            setLastFolders(newLastFoldersArray);
        }
    }

    const onClickEditButton = (item: IResource) => {
        setIsEditFileOpen(true);
        setFileToBeEdited(item);
        setName(item.name);
        setDescription(item.description === undefined ? "" : item.description);
        setInitialCurrentFolder(currentFolder);
    }

    const onChangeFileLocationSubmit = () => {
        if (fileToBeEdited && currentFolder && initialCurrentFolder !== currentFolder) {
            apiClient.patch(`/resource/${fileToBeEdited.resourceId}/path`, {}, {
                params: {newParentId: currentFolder.resourceId},
                headers: {Authorization: "TOKEN"}
            })
                .then((res) => {
                    if (currentFolder.children) {
                        setCurrentFolder({...currentFolder, children: [...currentFolder.children, res.data]});
                    }
                    setFileToBeEdited(undefined);
                    setIsEditFileOpen(false);
                    setRefreshing(!refreshing);
                })
                .catch(err => console.log(err.message));
        }
    }

    const onChangeFilePropertiesSubmit = () => {
        if (fileToBeEdited) {
            let params;
            if (name !== fileToBeEdited.name && name.trim() !== "" && description !== fileToBeEdited.description && description.trim() !== "") {
                params = {
                    name: name,
                    description: description
                }
            } else if (name !== fileToBeEdited.name && name.trim() !== "") {
                params = {
                    name: name
                }
            } else if (description !== fileToBeEdited.description && description.trim() !== "") {
                params = {
                    description: description
                }
            }
            if (params) {
                apiClient.patch(`/resource/${fileToBeEdited.resourceId}`, {}, {
                    params: params,
                    headers: {Authorization: "TOKEN"}
                })
                    .then((res) => {
                        if (currentFolder.children) {
                            setCurrentFolder({...currentFolder, children: [...currentFolder.children.filter(x => x.resourceId === res.data), res.data]});
                        }
                        setIsEditFileOpen(false);
                        setRefreshing(!refreshing);
                    })
                    .catch(err => console.log(err.message));
            }
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton/>
                    </IonButtons>
                    <IonTitle>File Manager</IonTitle>
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
                        <div><IonSearchbar color="primary" onIonInput={(e) => {
                            setCurrentFolder(rootFolder);
                            setLastFolders(undefined);
                            setSearch(e.target.value)
                        }} animated={true} placeholder="Global Search" className={"p-0"}/></div>
                        <div><IonSelect defaultValue={fileExtensionOptions[0]} interface={"popover"}
                                        placeholder={"Type"}
                                        onIonChange={e => setFileExtension(e.detail.value)}>{fileExtensionOptions.map(x =>
                            <IonSelectOption key={x} value={x}>{x}</IonSelectOption>)}</IonSelect></div>
                        <div><IonButton disabled={lastFolders === undefined}
                                        onClick={goBackToLastFolder}>Back</IonButton></div>
                    </div>
                </div>
                <FileList resources={currentFolder.children} handleOnClickFileListItem={handleOnClickFileListItem}
                          deleteFile={deleteFile} showPath={showPath} onClickEditButton={onClickEditButton}/>
                <Modal title={"Add File"} isOpen={isAddFileOpen} setIsOpen={setIsAddFileOpen}>
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
                </Modal>
                <Modal title={"Create Folder"} isOpen={isAddFolderOpen} setIsOpen={setIsAddFolderOpen}>
                    <IonContent className="ion-padding">
                        <IonInput
                            label="Name"
                            labelPlacement="stacked"
                            type="text"
                            placeholder="Folder name"
                            onIonChange={(e) => setName("" + e.target.value)}
                        />
                        <IonButton type={"button"} className={"w-full"} onClick={() => createFolder()}>Create
                            Folder</IonButton>
                    </IonContent>
                </Modal>
                <Modal title={"Edit"} isOpen={isEditFileOpen} setIsOpen={setIsEditFileOpen} backgroundColor={"black"}>
                    <IonContent className="ion-padding">
                        <div className={"mb-10 w-full"}>
                            <IonTitle>Change File Properties</IonTitle>
                            <div className={"mx-5 mb-5"}>
                                <IonInput
                                    label="Name"
                                    labelPlacement="stacked"
                                    type="text"
                                    value={name}
                                    onIonChange={(e) => setName("" + e.target.value)}
                                />
                                <IonInput
                                    label="Description"
                                    labelPlacement="stacked"
                                    type="text"
                                    value={description}
                                    onIonChange={(e) => setDescription("" + e.target.value)}
                                />
                            </div>
                            <IonButton type={"button"} className={"w-full"} onClick={() => onChangeFilePropertiesSubmit()}>Submit Changes To File Properties</IonButton>
                        </div>

                        {fileToBeEdited && fileToBeEdited.type === ResourceType.FILE ? <div>
                            <IonTitle>Move File / Change File Location</IonTitle>
                            <div className={"flex flex-row justify-between px-5 mt-3"}>
                                <IonChip
                                    color="primary">{lastFolders ? lastFolders.map(x => x.name).join("/").substring(1) + "/" + currentFolder.name : currentFolder.name}</IonChip>
                                <IonButton disabled={lastFolders === undefined}
                                           onClick={goBackToLastFolder}>Back</IonButton>
                            </div>
                            <FileList resources={currentFolder.children?.filter(x => x.type === ResourceType.FOLDER)}
                                      handleOnClickFileListItem={handleOnClickFileListItem}
                                      deleteFile={deleteFile}/>
                            <IonButton type={"button"} className={"w-full mt-10"} onClick={() => onChangeFileLocationSubmit()}>Submit Changes To File Location</IonButton>
                        </div> : <></>}
                    </IonContent>
                </Modal>
            </IonContent>
        </IonPage>
    );
};

export default FileManagerPage;