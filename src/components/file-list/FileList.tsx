/**
 * Project: araceli-frontend
 * Created by: Nico Bulut
 * Created at: 28.05.24
 */

import React from 'react';
import {IonList, IonText} from "@ionic/react";
import FileListItem from "./file-list-item/FileListItem";
import {IResource} from "../../common/models";

interface IFileListProps {
    resources?: IResource[];
    handleOnClickFileListItem: (item: IResource) => void;
}

const FileList = ({resources, handleOnClickFileListItem}: IFileListProps) => {
    return (
        <>
            {
                resources && resources.length > 0 ? <IonList lines={"full"} inset mode={"ios"}>
                    {resources.map(x => <FileListItem key={x.resourceId} item={x} handleOnClickFileListItem={handleOnClickFileListItem}/>)}
                </IonList>
                    : <IonText className={"m-4"}>There is no content in this folder.</IonText>
            }
        </>
    );
};

export default FileList;