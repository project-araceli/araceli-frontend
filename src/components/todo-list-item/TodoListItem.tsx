/**
 * Project: araceli-frontend
 * Created by: Nico Bulut
 * Created at: 08.05.24
 */

import React from 'react';
import {IonButton, IonCheckbox, IonIcon, IonItem, IonLabel, IonReorder} from "@ionic/react";
import {trash} from "ionicons/icons";
import {ITodoListItem} from "../../common/models";

interface ITodoListItemProps {
    item: ITodoListItem;
    onToggleIsDoneCheckbox: (item: ITodoListItem) => void;
    deleteItem: (id: string) => void;
}

const TodoListItem = ({item, onToggleIsDoneCheckbox, deleteItem}: ITodoListItemProps) => {

    const handleOnClickCheckbox = () => {
        item.isDone = !item.isDone;
        onToggleIsDoneCheckbox(item);
    }
    return (
        <IonItem button={false}>
            <IonCheckbox slot={"start"} checked={item.isDone} onClick={() => handleOnClickCheckbox()}/>
            <IonLabel>{item.name}</IonLabel>
            <IonButton color={"danger"} onClick={() => deleteItem(item.itemId)}>
                <IonIcon slot="icon-only" icon={trash}></IonIcon>
            </IonButton>
            <IonReorder slot="end"></IonReorder>
        </IonItem>
    );
};

export default TodoListItem;