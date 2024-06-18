/**
 * Project: araceli-frontend
 * Created by: Michael Hütter
 * Created at: 18.06.2024
 */
import {IResource} from "../../common/models";
import {IonList, IonText} from "@ionic/react";
import FileListItem from "./file-list-item/FileListItem";
import React from "react";
import FileListItemShared from "./file-list-item/FileListItemShared";

interface IFileListSharedProps {
    resources?: IResource[];
    handleOnClickFileListItem: (item: IResource) => void;
}

const FileListShared = ({resources, handleOnClickFileListItem}: IFileListSharedProps) => {
    return (
        <>
            {
                resources && resources.length > 0 ? <IonList lines={"full"} inset mode={"ios"}>
                        {resources?.map(x => <FileListItemShared key={x.resourceId} item={x} handleOnClickFileListItem={handleOnClickFileListItem}/>)}
                    </IonList>
                    : <IonText className={"m-4"}>There is no content in this folder.</IonText>
            }
        </>
    );
};

export default FileListShared;